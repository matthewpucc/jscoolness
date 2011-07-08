$(function() {
    var feed = "https://gdata.youtube.com/feeds/api/playlists/FBD82D6FD745CF7D?v=2&alt=jsonc";
    var where = {
        id: "put-it-here",
        ele: $('#put-it-here')
    } ;
    var player = {
        id: "player",
        ele: $('#player')
    };
    var sizes = {
        window: {
            width: $(document).width(),
            height: $(document).height()
        },
        outer : {
            width: 700,
            height: 400
        },
        panel : {
            width: 230,
            height: 172
        },
        player: {
            width: 700,
            height: 400
        }
    };
    var run = 0;
    var activeVideo = false;
    
    $.ajax({
        url: feed,
        success: function(data) {
            letsdoit(data);
        }
    });
    
    var addCSS3Property = function( ele, prop, value ) {
        var css = {};
        css['-o-'+ prop] = css['-moz-' + prop] = css['-webkit-' + prop] = css[prop] = value;
       $(ele).css(css) ;
       return $(ele);
    };
    
    var momentum = function (dist, time, maxDistUpper, maxDistLower, size) {
        var deceleration = 0.001,
        speed = dist / time,
        newDist = (speed * speed) / (2 * deceleration),
        newTime = 0, outsideDist = 0;

        // Proportinally reduce speed if we are outside of the boundaries 
        if (dist > 0 && newDist > maxDistUpper) {
            outsideDist = size / (6 / (newDist / speed * deceleration));
            maxDistUpper = maxDistUpper + outsideDist;
            speed = speed * maxDistUpper / newDist;
            newDist = maxDistUpper;
        } else if (dist < 0 && newDist > maxDistLower) {
            outsideDist = size / (6 / (newDist / speed * deceleration));
            maxDistLower = maxDistLower + outsideDist;
            speed = speed * maxDistLower / newDist;
            newDist = maxDistLower;
        }

        newDist = newDist * (dist < 0 ? -1 : 1);
        newTime = speed / deceleration;

        return {
            dist: newDist, 
            time: Math.round(Math.abs(newTime))
        };
    };
    
    var easeOutExpo = function (t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    };
    
    var scrollSpecified = function(ele, change) {
        var element = ele;
        
        var degX = (Number(element.data('degX')) - change.x) % 360;
        var degY = (Number(element.data('degY')) - change.y) % 360;

        addCSS3Property(element,'transform','rotateY(' + degY + 'deg) rotateX(' + degX + 'deg)');

        element.data('degX', degX);
        element.data('degY', degY);
    };
    
    var scrollSpecial = function(ele, change){
        var element = ele;
        
        var degX = (change.origX + change.x) % 360;
        var degY = (change.origY + change.y) % 360;
        
        addCSS3Property(element, 'transform','rotateY(' + degY + 'deg) rotateX(' + degX + 'deg)');
        
        element.data('degX', degX);
        element.data('degY', degY);
    }
    
    var scroll = function(ele) {
        var element = ele;
        
        var degX = Number(element.data('degX'));
        var degY = Number(element.data('degY'));

        var increment = 0.75;
        switch ( run ) {
            case 1:
                degY += increment;
                degY = degY % 360;
                addCSS3Property(element,'transform','rotateY(' + degY + 'deg)');
                break;
            case -1:
                degY -= increment;
                degY = degY % 360;
                addCSS3Property(element,'transform','rotateY(' + degY + 'deg)');
                break;
        }

        element.data('degX', degX);
        element.data('degY', degY);
        setTimeout( function() {
            scroll(ele);
        }, 10);
            
    };
    
    var letsdoit = function(data) {
        var videos = parseFeed(data);
        var css = genCSS(videos.count);
        var position = {
            start: {},
            stale: {},
            end: {}
        };
        
        var box = $(document.createElement('div')).attr({
            id: where.id + "-box"
        });
        
        where.ele
        .append($(document.createElement('div')).css({
            'height': sizes.outer.height + "px", 
            'width': (sizes.outer.width * (3/10)) + "px",
            'float': 'left'
        }).bind('mouseover mousedown touchstart', function() {
            run = -1;
        }).bind('mouseout mouseup touchend', function() {
            run = 0;
        }))
        .append($(document.createElement('div')).css({
            'height': sizes.outer.height + "px", 
            'width': (sizes.outer.width / 3) + "px", 
            'float': 'right',
        }).bind('mouseover mousedown touchstart', function() {
            run = 1;
        }).bind('mouseout mouseup touchend', function() {
            run = 0;
        }));
        
        for(var i = 0; i < videos.count; i++) {
            (function(video, x) {
                box.append(
                    $(document.createElement('div')).attr({
                        id: where.id + "-panel-" + x
                    })
                    .append(
                        $(document.createElement('img'))
                        .attr({
                            src: video.image,  
                            alt: video.title
                        })
                        .css({
                            height: (sizes.panel.height - 10) + "px", 
                            'max-width': (sizes.panel.width-10) + "px", 
                            margin: "4px auto"
                        })
                        )
                    .bind('click dblclick keydown', {
                        video: video
                    }, function(e) {
                        run = 0;
                        activeVideo = true;
                        addCSS3Property($('#'+where.id+"-stage"),'transform', 'translateZ(-800px)').data('z', -800);
                        setTimeout(function() {
                            playVideo(e.data.video);
                        }, 2500);
                    })
                    );
            })(videos.video[i], i);
        }
        
        $('head').prepend($(document.createElement('style')).attr({
            type: "text/css"
        }).text(css));
        
        $(document.createElement('div')).attr({
            id: where.id + "-stage"
        }).data('z',-200).append(box).appendTo(where.ele);
        
        $('#'+where.id+'-box').data({
            'degX': 0, 
            'degY': 0
        });
        setTimeout(function() {
            scroll($('#'+where.id+'-box'));
        }, 100);
       
        $('#'+where.id).get(0).ontouchstart = function(e) {
            //e.preventDefault();
            position.start.x = position.stale.x = e.touches ? e.touches[0].pageX : e.pageX;
            position.start.y = position.stale.y = e.touches ? e.touches[0].pageY : e.pageY;
            position.start.time = (new Date).getTime();
        };
        $('#'+where.id).get(0).ontouchmove = function(e) {
            if( e.touches.length == 1 ){
                e.preventDefault();
                
                var touch = {
                    x: e.touches ? e.touches[0].pageX : e.pageX,
                    y: e.touches ? e.touches[0].pageY : e.pageY
                };

                var change = {
                    x: 0, 
                    y: 0
                };

                change.y = ((position.stale.x - touch.x) / sizes.window.width) * 180;
                //change.x = ((position.stale.y - touch.y) / sizes.window.height) * 180;

                scrollSpecified($('#'+where.id+'-box'), change);

                position.stale.x = touch.x;
                position.stale.y = touch.y;
            }
            if( e.touches.length == 2 ) {
        //                e.preventDefault();
        //                
        //                var newScale = Number($('#'+where.id+"-stage").data('z')) * (1/e.scale);
        //                
        //                $('#'+where.id+"-stage").css('-webkit-transform', 'translateZ('+ newScale + 'px)');
        //                $('#'+where.id+"-stage").data('z', newScale);
        }
        };
        $('#'+where.id).get(0).ontouchend = function(e) {
            var touch = e.touches[0] || e;
            
            position.end.x =  position.stale.x;
            position.end.y = position.stale.x;
            position.end.time = (new Date).getTime();
            var results = {
                x: momentum((position.start.x - position.end.x), (position.end.time - position.start.time), sizes.window.width, -sizes.window.width, sizes.outer.width),
                y: momentum((position.start.y - position.end.y), (position.end.time - position.start.time), sizes.window.height, -sizes.window.height, sizes.outer.height)
            };
            
            var change = {
                x: 0, 
                y: 0
            };
        
            change.y = (results.x.dist / sizes.window.width)  * 15 * ((position.start.x - position.end.x) < 0 ? -1 : 1);
            //change.x = (results.y.dist / sizes.window.height) * 10 * * ((position.start.y - position.end.y) < 0 ? 1 : -1);
            
            (function( ele, time, change ) {
                var c_time = 0;
                var status = {
                    origX : Number(ele.data('degX')),
                    origY : Number(ele.data('degY')),
                    x: easeOutExpo(c_time, 0, change.x, time),
                    y: easeOutExpo(c_time, 0, change.y, time)
                };
                
                var keepGoing = function() {
                    scrollSpecified(ele, status);
                    c_time = c_time + 10;
                        
                    status.x =  change.x - easeOutExpo(c_time, 0, change.x, time);
                    status.y =  change.y - easeOutExpo(c_time, 0, change.y, time);

                    if( c_time < time ) {
                        setTimeout(function() {
                            keepGoing();
                        }, 10);
                    } 
                };

                keepGoing();
               
            })($('#'+where.id+"-box"), results.y.time, change ); 
        };
    };
    
    var playVideo = function( video ) {
        player.ele.empty()
        .append(
            $(document.createElement('div')).css({
                height: '30px', 
                width: '30px', 
                margin: '3px', 
                'float': 'right', 
                'font-size': '24pt', 
                color: 'white', 
                cursor: 'pointer'
            }).text('X').bind('click dblclick keydown', function() {
                addCSS3Property(player.ele, 'transform', 'perspective(2000px) translateZ(-2000px)');
                setTimeout(function() {
                    player.ele.fadeOut(800, function() {
                        player.ele.empty();
                        addCSS3Property($('#'+where.id+"-stage"), 'transform', 'translateZ(-200px)').data('z', -200);
                    });
                },2250);
            })
            )
        .fadeIn(900, function() {
            setTimeout(function() {
                addCSS3Property(player.ele, 'transform', 'perspective(0px) translateZ(0px)');
                setTimeout(function() {
                    player.ele.empty()
                    .append(
                        $(document.createElement('div'))
                        .css({
                            height: '30px', 
                            width: '30px', 
                            margin: '3px', 
                            'float': 'right', 
                            'font-size': '24pt', 
                            color: 'white', 
                            cursor: 'pointer'
                        })
                        .text('X')
                        .bind('click dblclick keydown', function() {
                            player.ele.empty();
                            addCSS3Property(player.ele, 'transform', 'perspective(2000px) translateZ(-2000px)');
                            setTimeout(function() {
                                player.ele.fadeOut(800, function() {
                                    addCSS3Property($('#'+where.id+"-stage"), 'transform', 'translateZ(-200px)').data('z', -200);
                                });
                            },2250);
                        })
                        )
                    .append(
                        $(document.createElement('iframe'))
                        .attr({
                            src: "http://www.youtube.com/embed/" + video.id
                        })
                        .css({
                            border: 'none', 
                            height:sizes.player.height-50, 
                            width: sizes.player.width -20, 
                            margin: '10px'
                        })
                        )
                },2250);
            }, 250);
        });
        return true;
    }
    
    var genCSS = function( videos ) {
        var deg_per_video = Math.floor(360/videos);
        
        var css = "";
        css = css + "#" + where.id + " { background: rgb(84,101,112); background: -moz-linear-gradient(top, rgba(84,101,112,1) 0%, rgba(89,113,127,1) 35%, rgba(79,101,114,1) 50%, " +
        "rgba(89,114,127,1) 65%, rgba(74,95,107,1) 100%); background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(84,101,112,1)), color-stop(35%,rgba(89,113,127,1)), " + 
        "color-stop(50%,rgba(79,101,114,1)), color-stop(65%,rgba(89,114,127,1)), color-stop(100%,rgba(74,95,107,1))); background: " + 
        "-webkit-linear-gradient(top, rgba(84,101,112,1) 0%,rgba(89,113,127,1) 35%,rgba(79,101,114,1) 50%,rgba(89,114,127,1) 65%,rgba(74,95,107,1) 100%); background: " + 
        "-o-linear-gradient(top, rgba(84,101,112,1) 0%,rgba(89,113,127,1) 35%,rgba(79,101,114,1) 50%,rgba(89,114,127,1) 65%,rgba(74,95,107,1) 100%); background: " + 
        "-ms-linear-gradient(top, rgba(84,101,112,1) 0%,rgba(89,113,127,1) 35%,rgba(79,101,114,1) 50%,rgba(89,114,127,1) 65%,rgba(74,95,107,1) 100%); filter: " + 
        "progid:DXImageTransform.Microsoft.gradient( startColorstr='#546570', endColorstr='#4a5f6b',GradientType=0 ); background: linear-gradient(top, rgba(84,101,112,1) 0%," +
        "rgba(89,113,127,1) 35%,rgba(79,101,114,1) 50%,rgba(89,114,127,1) 65%,rgba(74,95,107,1) 100%);-webkit-perspective: 800; -webkit-perspective-origin: 50% 225px; width: " + 
        sizes.outer.width + "px; height: "+ sizes.outer.height + "px; margin: 0 auto;} ";
        css = css + "#" + where.id + "-stage { -o-transform: translateZ(-200px); -moz-transform: translateZ(-200px); transform: translateZ(-200px); -webkit-transform: translateZ(-200px); " +
            "-webkit-transition: -webkit-transform 2s; -moz-transition: -moz-transform 2s; -o-transition: -o-transform 2s; transition: transform 2s; -webkit-transform-style: preserve-3d; "+
            "-moz-transform-style: preserve-3d; -o-transform-style: preserve-3d; transform-style: preserve-3d; width: " + sizes.outer.width + "px; height: " + sizes.outer.height + "px; } ";
        css = css + "#" + where.id + "-box { -webkit-transform-style: preserve-3d; -moz-transform-style: preserve-3d; -o-transform-style: preserve-3d; transform-style: preserve-3d; " +
            "position: relative; top: " + Math.floor((sizes.outer.height - sizes.panel.height)/2) + "px; margin: 0 auto; width: " + sizes.panel.width + "px; height: " + sizes.panel.height + "px; } ";
        css = css + "div[id^='" + where.id + "-panel'] { position: absolute; height: " + sizes.panel.height + "px; width: " + sizes.panel.width + "px; border: 1px solid rgb(45,45,45); " +
        "-webkit-border-radius: 12px; -moz-border-radius: 12px; border-radius: 12px; text-align: center; background-color: rgba(255, 255, 255,0.6); margin: 2px 2px; " +
        "-moz-backface-visibility: visible; -o-backface-visibility: visible; backface-visibility: visible; -webkit-backface-visibility: visible; } " ;
        css = css + "div[id^='" + where.id + "-panel']:hover { margin: 1px 1px; border: 2px solid white; } ";
        css = css + "#" + player.id + "{  height: " + sizes.player.height + "px; width: " + sizes.player.width + "px; display: none; background: rgba(33,33,33,0.5); -webkit-transform:" +
        "perspective(2000px) translateZ(-2000px); -moz-transform: perspective(2000px) translateZ(-2000px); -o-transform: perspective(2000px) translateZ(-2000px); transform: "  +
        "perspective(2000px) translateZ(-2000px); -webkit-border-radius: 10px; -moz-border-radius: 10px; border-radius: 10px; margin: 0px auto; position: relative; top: -" + sizes.outer.height + 
        "px; -webkit-transition: -webkit-transform 2s; -webkit-transform-style : preserve-3d; -moz-transition: -moz-transform 2s; -moz-transform-style : preserve-3d; " +
        "-o-transition: -o-transform 2s; -o-transform-style : preserve-3d; transition: transform 2s; transform-style : preserve-3d;} ";
        
        for( var i = 0; i < videos; i++ ) {
            var degs = (i*deg_per_video)
            css = css +  "#" + where.id + "-panel-" + i + " { -webkit-transform: rotateY("+ degs + "deg) translateZ(" + (sizes.panel.width + 10) + "px); -moz-transform:" +
                "rotateY("+ degs + "deg) translateZ(" + (sizes.panel.width + 10) + "px); -o-transform: rotateY("+ degs + "deg) translateZ(" + (sizes.panel.width + 10) + "px); " +
                 "transform: rotateY("+ degs + "deg) translateZ(" + (sizes.panel.width + 10) + "px);} ";
        }
        
        return css;
    };
    
    var parseFeed= function(data) {
        var videos = {};
        videos.playlist = data.data.title;
        videos.count = data.data.items.length;
        videos.video = [];
        for(var i = 0; i < videos.count; i++){
            (function(video) {
                videos.video.push({
                    image: video.video.thumbnail.hqDefault || video.video.thumbnail.sqDefault,
                    title: video.video.title,
                    id: video.video.id
                });
            })(data.data.items[i]);
        }
       
        return videos;
    };
});
