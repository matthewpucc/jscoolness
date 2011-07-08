(function( $ ) {
    var settings= {
        sizes: {
            panel: {
                w: 230,
                h: 172
            },
            outer: {}
        },
        frameLength : 10,
        frameDistance: 0.75
    };
    
    var utils = {
        main: function( data ) {
                var options = this;
                utils.parseFeed.call(options, data);
                $('head').first().prepend( $(document.createElement('style')).attr({ type: 'text/css' }).text( utils.genCSS.call( options ) ));
        },
        playVideo : function( video ) {
            var options = this;
            options.player.ele.empty()
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
                    addCSS3Property(options.player.ele, 'transform', 'perspective(2000px) translateZ(-2000px)');
                    setTimeout(function() {
                        options.player.ele.fadeOut(800, function() {
                            options.player.ele.empty();
                            $('#'+options.where.id+"-stage").scc3('transform', 'translateZ(-200px)').data('z', -200);
                        });
                    },2250);
                })
                )
            .fadeIn(900, function() {
                setTimeout(function() {
                    options.player.ele.css3('transform', 'perspective(0px) translateZ(0px)');
                    setTimeout(function() {
                        options.player.ele.empty()
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
                                options.player.ele.empty().css3( 'transform', 'perspective(2000px) translateZ(-2000px)');
                                setTimeout(function() {
                                    options.player.ele.fadeOut(800, function() {
                                        $('#'+options.where.id+"-stage").css3( 'transform', 'translateZ(-200px)').data('z', -200);
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
                                height:options.sizes.outer.height-50, 
                                width: options.sizes.outer.width -20, 
                                margin: '10px'
                            })
                            )
                    },2250);
                }, 250);
            });
            return true;
        },
        parseFeed: function(data) {
            var options = this;
            options.videos = {};
            options.videos.playlist = data.data.title;
            options.videos.count = data.data.items.length;
            options.videos.video = [];
            for(var i = 0; i < videos.count; i++){
                (function(video) {
                    options.videos.video.push({
                        image: video.video.thumbnail.hqDefault || video.video.thumbnail.sqDefault,
                        title: video.video.title,
                        id: video.video.id
                    });
                })(data.data.items[i]);
            }
        },
        genCSS : function( ) {
            var options = this;
            var deg_per_video = Math.floor(360/options.videos.count);
        
            var css = "";
            css = css + "#" + options.where.id + " { background: rgb(84,101,112); background: -moz-linear-gradient(top, rgba(84,101,112,1) 0%, rgba(89,113,127,1) 35%, rgba(79,101,114,1) 50%, " +
            "rgba(89,114,127,1) 65%, rgba(74,95,107,1) 100%); background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(84,101,112,1)), color-stop(35%,rgba(89,113,127,1)), " + 
            "color-stop(50%,rgba(79,101,114,1)), color-stop(65%,rgba(89,114,127,1)), color-stop(100%,rgba(74,95,107,1))); background: " + 
            "-webkit-linear-gradient(top, rgba(84,101,112,1) 0%,rgba(89,113,127,1) 35%,rgba(79,101,114,1) 50%,rgba(89,114,127,1) 65%,rgba(74,95,107,1) 100%); background: " + 
            "-o-linear-gradient(top, rgba(84,101,112,1) 0%,rgba(89,113,127,1) 35%,rgba(79,101,114,1) 50%,rgba(89,114,127,1) 65%,rgba(74,95,107,1) 100%); background: " + 
            "-ms-linear-gradient(top, rgba(84,101,112,1) 0%,rgba(89,113,127,1) 35%,rgba(79,101,114,1) 50%,rgba(89,114,127,1) 65%,rgba(74,95,107,1) 100%); filter: " + 
            "progid:DXImageTransform.Microsoft.gradient( startColorstr='#546570', endColorstr='#4a5f6b',GradientType=0 ); background: linear-gradient(top, rgba(84,101,112,1) 0%," +
            "rgba(89,113,127,1) 35%,rgba(79,101,114,1) 50%,rgba(89,114,127,1) 65%,rgba(74,95,107,1) 100%);-webkit-perspective: 800; -webkit-perspective-origin: 50% 225px; width: " + 
            options.sizes.outer.width + "px; height: "+ options.sizes.outer.height + "px; margin: 0 auto;} ";
            css = css + "#" + options.where.id + "-stage { -o-transform: translateZ(-200px); -moz-transform: translateZ(-200px); transform: translateZ(-200px); -webkit-transform: translateZ(-200px); " +
            "-webkit-transition: -webkit-transform 2s; -moz-transition: -moz-transform 2s; -o-transition: -o-transform 2s; transition: transform 2s; -webkit-transform-style: preserve-3d; "+
            "-moz-transform-style: preserve-3d; -o-transform-style: preserve-3d; transform-style: preserve-3d; width: " + options.sizes.outer.width + "px; height: " + options.sizes.outer.height + "px; } ";
            css = css + "#" + options.where.id + "-box { -webkit-transform-style: preserve-3d; -moz-transform-style: preserve-3d; -o-transform-style: preserve-3d; transform-style: preserve-3d; " +
            "position: relative; top: " + Math.floor((options.sizes.outer.height - options.sizes.panel.height)/2) + "px; margin: 0 auto; width: " + options.sizes.panel.width + "px; height: " +options. sizes.panel.height + "px; } ";
            css = css + "div[id^='" + where.id + "-panel'] { position: absolute; height: " + options.sizes.panel.height + "px; width: " + options.sizes.panel.width + "px; border: 1px solid rgb(45,45,45); " +
            "-webkit-border-radius: 12px; -moz-border-radius: 12px; border-radius: 12px; text-align: center; background-color: rgba(255, 255, 255,0.6); margin: 2px 2px; " +
            "-moz-backface-visibility: visible; -o-backface-visibility: visible; backface-visibility: visible; -webkit-backface-visibility: visible; } " ;
            css = css + "div[id^='" + options.where.id + "-panel']:hover { margin: 1px 1px; border: 2px solid white; } ";
            css = css + "#" + options.player.id + "{  height: " + options.sizes.outer.height + "px; width: " + options.sizes.outer.width + "px; display: none; background: rgba(33,33,33,0.5); -webkit-transform:" +
            "perspective(2000px) translateZ(-2000px); -moz-transform: perspective(2000px) translateZ(-2000px); -o-transform: perspective(2000px) translateZ(-2000px); transform: "  +
            "perspective(2000px) translateZ(-2000px); -webkit-border-radius: 10px; -moz-border-radius: 10px; border-radius: 10px; margin: 0px auto; position: relative; top: -" + options.sizes.outer.height + 
            "px; -webkit-transition: -webkit-transform 2s; -webkit-transform-style : preserve-3d; -moz-transition: -moz-transform 2s; -moz-transform-style : preserve-3d; " +
            "-o-transition: -o-transform 2s; -o-transform-style : preserve-3d; transition: transform 2s; transform-style : preserve-3d;} ";
        
            for( var i = 0; i < options.videos.count; i++ ) {
                var degs = (i*deg_per_video)
                css = css +  "#" + where.id + "-panel-" + i + " { -webkit-transform: rotateY("+ degs + "deg) translateZ(" + (options.sizes.panel.width + 10) + "px); -moz-transform:" +
                "rotateY("+ degs + "deg) translateZ(" + (options.sizes.panel.width + 10) + "px); -o-transform: rotateY("+ degs + "deg) translateZ(" + (options.sizes.panel.width + 10) + "px); " +
                "transform: rotateY("+ degs + "deg) translateZ(" + (options.sizes.panel.width + 10) + "px);} ";
            }
        
            return css;
        },
        momentum : function (dist, time, maxDistUpper, maxDistLower, size) {
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
        },
        easeOutExpo : function (t, b, c, d) {
            return c - ((t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b);
        },
        scroll: {
            specified: function(ele, change) {
                var options = this;
                var element = $(ele);
        
                var degX = (Number(element.data('degX')) - change.x) % 360;
                var degY = (Number(element.data('degY')) - change.y) % 360;

                element.css3('transform','rotateY(' + degY + 'deg) rotateX(' + degX + 'deg)');

                element.data('degX', degX);
                element.data('degY', degY);
            },
            normal: function( ele ) {
                var options = this;
                var element = $(ele);

                var run = element.data('run');

                var degX = Number(element.data('degX'));
                var degY = Number(element.data('degY'));

                switch ( run ) {
                    case 1:
                        degY += options.frameDistance;
                        degY = degY % 360;
                        element.css3('transform','rotateY(' + degY + 'deg)');
                        break;
                    case -1:
                        degY -= options.frameDistance;
                        degY = degY % 360;
                        element.css3('transform','rotateY(' + degY + 'deg)');
                        break;
                }

                element.data('degX', degX);
                element.data('degY', degY);
                
                setTimeout( function() {
                    utils.scroll.normal(ele);
                }, options.frameLength);
            
            }
        }
    };
    
    $.fn.ytgallery = function( url, options_in ) {
        var options = $.extend( settings, options_in );
        
        options.where = {
            id: this.attr('id'),
            ele: this
        };
        
        options.player = {
            id: options.where.id + "-player"
        };
        
        $('body').append($(document.createElement('div')).attr({
            id: options.player.id
        }));
        
        options.player.ele = $('#' + options.player.id);
        
        options.sizes.outer.width = this.innerWidth();
        options.sizes.outer.height = this.innerHeight();
        
        $.ajax({
            url: url,
            success: function(data) {
                utils.main.call(options, data);
            }
        });        
    };
})( jQuery );

(function( $ ) {
    $.fn.css3 = function( prop, value ) {
        var css = {};
        css['-o-'+ prop] = css['-moz-' + prop] = css['-webkit-' + prop] = css[prop] = value;
        
        this.css(css)
        
        return this;
    }
})(  jQuery );