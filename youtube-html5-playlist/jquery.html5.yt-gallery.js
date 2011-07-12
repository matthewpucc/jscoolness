(function( $ ) {
    var settings= {
        sizes: {
            panel: {
                width: 230,
                height: 172
            },
            outer: {}
        },
        frameLength : 10,
        frameDistance: 0.75,
        position : {
            start: {},
            stale: {},
            end: {}
        }
    };
    
    function utils ( options ) {
        this.opts = options;
    }
   
    utils.prototype.main = function(  data ) {
            
        console.debug(this.opts.where.id);
            
        $('body').append($(document.createElement('div')).attr({
            id: this.opts.where.id + "-player"
        }));
            
        this.opts.player = {
            id: this.opts.where.id + "-player",
            ele: $('#'+ this.opts.where.id + "-player")
        };
            
        this.parseFeed( data);
            
        $('head').first().prepend( $(document.createElement('style')).attr({
            type: 'text/css'
        }).text( this.genCSS( ) ));
            
        this.genHTML( );
        this.bindMobileSafariEvents ( );
            
        var that = this;
        setTimeout(function() {
            that.scrollNormal( $('#'+that.opts.where.id+'-box'));
        }, 100);
    };
    
    utils.prototype.playVideo = function( video ) {
        var that = this;
        this.opts.player.ele.empty()
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
                that.opts.player.ele.css3( 'transform', 'perspective(2000px) translateZ(-2000px)');
                setTimeout(function() {
                    that.opts.player.ele.fadeOut(800, function() {
                        that.opts.player.ele.empty();
                        $('#'+that.opts.where.id+"-stage").css3('transform', 'translateZ(-200px)').data('z', -200);
                    });
                },2250);
            })
            )
        .fadeIn(900, function() {
            setTimeout(function() {
                that.opts.player.ele.css3('transform', 'perspective(0px) translateZ(0px)');
                setTimeout(function() {
                    that.opts.player.ele.empty()
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
                            that.opts.player.ele.empty().css3( 'transform', 'perspective(2000px) translateZ(-2000px)');
                            setTimeout(function() {
                                that.opts.player.ele.fadeOut(800, function() {
                                    $('#'+that.opts.where.id+"-stage").css3( 'transform', 'translateZ(-200px)').data('z', -200);
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
                            height:this.opts.sizes.outer.height-50, 
                            width: this.opts.sizes.outer.width -20, 
                            margin: '10px'
                        })
                        )
                },2250);
            }, 250);
        });
        return true;
    };
    
    utils.prototype.parseFeed = function( data) {
        this.opts.videos = {};
        this.opts.videos.playlist = data.data.title;
        this.opts.videos.count = data.data.items.length;
        this.opts.videos.video = [];
        for(var i = 0; i < this.opts.videos.count; i++){
            var video =data.data.items[i];
            this.opts.videos.video.push({
                image: video.video.thumbnail.hqDefault || video.video.thumbnail.sqDefault,
                title: video.video.title,
                id: video.video.id
            });
        }
    };
            
            
    utils.prototype.genHTML = function( ) {
        var that = this;
            
        var box = $(document.createElement('div')).attr({
            id: this.opts.where.id + "-box"
        }).data({
            'run': 0, 
            'degX': 0, 
            'degY': 0
        });
            
        this.opts.where.ele
        .append($(document.createElement('div')).css({
            'height': this.opts.sizes.outer.height + "px", 
            'width': (this.opts.sizes.outer.width * (3/10)) + "px",
            'float': 'left'
        }).bind('mouseover mousedown touchstart', function() {
            $('#'+that.opts.where.id+"-box").data('run',-1);
        }).bind('mouseout mouseup touchend', function() {
            $('#'+that.opts.where.id+"-box").data('run',0);
        }))
        .append($(document.createElement('div')).css({
            'height': that.opts.sizes.outer.height + "px", 
            'width': (that.opts.sizes.outer.width / 3) + "px", 
            'float': 'right'
        }).bind('mouseover mousedown touchstart', function() {
            $('#'+that.opts.where.id+"-box").data('run',1);
        }).bind('mouseout mouseup touchend', function() {
            $('#'+that.opts.where.id+"-box").data('run',0);
        }));
            
        for( var i =0; i < this.opts.videos.count; i++ ) {
            (function(video, x) {
                box.append(
                    $(document.createElement('div')).attr({
                        id: that.opts.where.id + "-panel-" + x
                    })
                    .append(
                        $(document.createElement('img'))
                        .attr({
                            src: video.image,  
                            alt: video.title
                        })
                        .css({
                            height: (that.opts.sizes.panel.height - 10) + "px", 
                            'max-width': (that.opts.sizes.panel.width-10) + "px", 
                            margin: "4px auto"
                        })
                        )
                    .bind('click dblclick keydown', {
                        video: video
                    }, function(e) {
                        $('#'+that.opts.where.id + '-box').data({
                            'run' : 0
                        });
                        $('#'+that.opts.where.id+"-stage").css3('transform', 'translateZ(-800px)').data('z', -800);
                        setTimeout(function() {
                            that.playVideo(e.data.video);
                        }, 2500);
                    })
                    );
            })(this.opts.videos.video[i], i);
        }
            
        $(document.createElement('div')).attr({
            id: this.opts.where.id + "-stage"
        }).data('z',-200).append(box).appendTo(this.opts.where.ele);
    };
            
    utils.prototype.bindMobileSafariEvents = function( ) {
        (function(root_ele) {
            root_ele.ontouchstart = function(e) {
                // e.preventDefault(); will be necessary for android.
                this.opts.position.start.x = this.opts.position.stale.x = e.touches ? e.touches[0].pageX : e.pageX;
                this.opts.position.start.y = this.opts.position.stale.y = e.touches ? e.touches[0].pageY : e.pageY;
                this.opts.position.start.time = (new Date).getTime();
            };
            root_ele.ontouchmove = function(e) {
                if( e.touches.length == 1 ){
                    e.preventDefault();
                
                    var touch = {
                        x: e.touches ? e.touches[0].pageX : e.pageX,
                        y: e.touches ? e.touches[0].pageY : e.pageY
                    };

                    // x = ((position.stale.y - touch.y) / sizes.window.height) * 180;

                    this.scroll.specified($('#'+this.opts.where.id+'-box'), {
                        y: ((this.opts.position.stale.x - touch.x) / this.opts.sizes.window.width) * 180, 
                        x : 0
                    });

                    this.opts.position.stale.x = touch.x;
                    this.opts.position.stale.y = touch.y;
                }
            /* 
                  *            this is how to do zoom pinch. I dont quite care for it so I'm leaving it commented out
                  *                  if( e.touches.length == 2 ) {
                  *                      e.preventDefault();
                  *                      
                  *                      var newScale = Number($('#'+where.id+"-stage").data('z')) * (1/e.scale);
                  *         
                  *                      $('#'+where.id+"-stage").css('-webkit-transform', 'translateZ('+ newScale + 'px)');
                  *                      $('#'+where.id+"-stage").data('z', newScale);
                  *                  }         
                  */
            };
            
            root_ele.ontouchend = function() {
            
                this.opts.position.end.x =  this.opts.position.stale.x;
                this.opts.position.end.y = this.opts.position.stale.x;
                this.opts.position.end.time = (new Date).getTime();
                    
                var results = {
                    x: momentum(
                        (this.opts.position.start.x - this.opts.position.end.x), 
                        (this.opts.position.end.time - this.opts.position.start.time), 
                        this.opts.sizes.window.width, - this.opts.sizes.window.width, 
                        this.opts.sizes.outer.width
                        ),
                    y: momentum(
                        (this.opts.position.start.y - this.opts.position.end.y), 
                        (this.opts.position.end.time - this.opts.position.start.time), 
                        this.opts.sizes.window.height, -this.opts.sizes.window.height, 
                        this.opts.sizes.outer.height
                        )
                };
            
                (function( ele, time, change ) {
                    var c_time = 0;
                        
                    var status = {
                        origX : Number(ele.data('degX')),
                        origY : Number(ele.data('degY')),
                        x: easeOutExpo(c_time, 0, change.x, time),
                        y: easeOutExpo(c_time, 0, change.y, time)
                    };
                
                    var that = this;
                            
                    var keepGoing = function() {
                        that.scroll.specified(ele, status);
                        c_time = c_time + 10;
                        
                        status.x =  change.x - that.easeOutExpo(c_time, 0, change.x, time);
                        status.y =  change.y -  that.easeOutExpo(c_time, 0, change.y, time);

                        if( c_time < time ) {
                            setTimeout(function() {
                                keepGoing();
                            }, that.opts.frameLength);
                        } 
                    };

                    keepGoing();
               
                })($('#'+this.opts.where.id+"-box"), results.y.time, {
                    y: (results.x.dist / this.opts.sizes.window.width)  * 15 * ((this.opts.position.start.x - this.opts.position.end.x) < 0 ? -1 : 1), 
                    x: 0
                } ); 
                    
            // this is here if you want it. scrolling in the way doesnt provide a good experience in my opinion
            // x = (results.y.dist / sizes.window.height) * 10 * * ((position.start.y - position.end.y) < 0 ? 1 : -1);
            }
        })(this.opts.where.ele.get(0));
    }
            
    utils.prototype.genCSS = function( ) {
        var deg_per_video = Math.floor(360/this.opts.videos.count);
        
        var css = "";
        css = css + "#" + this.opts.where.id + " { background: rgb(84,101,112); background: -moz-linear-gradient(top, rgba(84,101,112,1) 0%, rgba(89,113,127,1) 35%, rgba(79,101,114,1) 50%, " +
        "rgba(89,114,127,1) 65%, rgba(74,95,107,1) 100%); background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(84,101,112,1)), color-stop(35%,rgba(89,113,127,1)), " + 
        "color-stop(50%,rgba(79,101,114,1)), color-stop(65%,rgba(89,114,127,1)), color-stop(100%,rgba(74,95,107,1))); background: " + 
        "-webkit-linear-gradient(top, rgba(84,101,112,1) 0%,rgba(89,113,127,1) 35%,rgba(79,101,114,1) 50%,rgba(89,114,127,1) 65%,rgba(74,95,107,1) 100%); background: " + 
        "-o-linear-gradient(top, rgba(84,101,112,1) 0%,rgba(89,113,127,1) 35%,rgba(79,101,114,1) 50%,rgba(89,114,127,1) 65%,rgba(74,95,107,1) 100%); background: " + 
        "-ms-linear-gradient(top, rgba(84,101,112,1) 0%,rgba(89,113,127,1) 35%,rgba(79,101,114,1) 50%,rgba(89,114,127,1) 65%,rgba(74,95,107,1) 100%); filter: " + 
        "progid:DXImageTransform.Microsoft.gradient( startColorstr='#546570', endColorstr='#4a5f6b',GradientType=0 ); background: linear-gradient(top, rgba(84,101,112,1) 0%," +
        "rgba(89,113,127,1) 35%,rgba(79,101,114,1) 50%,rgba(89,114,127,1) 65%,rgba(74,95,107,1) 100%);-webkit-perspective: 800; -webkit-perspective-origin: 50% 225px; width: " + 
        this.opts.sizes.outer.width + "px; height: "+ this.opts.sizes.outer.height + "px; margin: 0 auto;} ";
        css = css + "#" + this.opts.where.id + "-stage { -o-transform: translateZ(-200px); -moz-transform: translateZ(-200px); transform: translateZ(-200px); -webkit-transform: translateZ(-200px); " +
        "-webkit-transition: -webkit-transform 2s; -moz-transition: -moz-transform 2s; -o-transition: -o-transform 2s; transition: transform 2s; -webkit-transform-style: preserve-3d; "+
        "-moz-transform-style: preserve-3d; -o-transform-style: preserve-3d; transform-style: preserve-3d; width: " + this.opts.sizes.outer.width + "px; height: " + this.opts.sizes.outer.height + "px; } ";
        css = css + "#" + this.opts.where.id + "-box { -webkit-transform-style: preserve-3d; -moz-transform-style: preserve-3d; -o-transform-style: preserve-3d; transform-style: preserve-3d; " +
        "position: relative; top: " + Math.floor((this.opts.sizes.outer.height - this.opts.sizes.panel.height)/2) + "px; margin: 0 auto; width: " + this.opts.sizes.panel.width + "px; height: " +this.opts. sizes.panel.height + "px; } ";
        css = css + "div[id^='" + this.opts.where.id + "-panel'] { position: absolute; height: " + this.opts.sizes.panel.height + "px; width: " + this.opts.sizes.panel.width + "px; border: 1px solid rgb(45,45,45); " +
        "-webkit-border-radius: 12px; -moz-border-radius: 12px; border-radius: 12px; text-align: center; background-color: rgba(255, 255, 255,0.6); margin: 2px 2px; " +
        "-moz-backface-visibility: visible; -o-backface-visibility: visible; backface-visibility: visible; -webkit-backface-visibility: visible; } " ;
        css = css + "div[id^='" + this.opts.where.id + "-panel']:hover { margin: 1px 1px; border: 2px solid white; } ";
        css = css + "#" + this.opts.player.id + "{  height: " + this.opts.sizes.outer.height + "px; width: " + this.opts.sizes.outer.width + "px; display: none; background: rgba(33,33,33,0.5); -webkit-transform:" +
        "perspective(2000px) translateZ(-2000px); -moz-transform: perspective(2000px) translateZ(-2000px); -o-transform: perspective(2000px) translateZ(-2000px); transform: "  +
        "perspective(2000px) translateZ(-2000px); -webkit-border-radius: 10px; -moz-border-radius: 10px; border-radius: 10px; margin: 0px auto; position: relative; top: -" + this.opts.sizes.outer.height + 
        "px; -webkit-transition: -webkit-transform 2s; -webkit-transform-style : preserve-3d; -moz-transition: -moz-transform 2s; -moz-transform-style : preserve-3d; " +
        "-o-transition: -o-transform 2s; -o-transform-style : preserve-3d; transition: transform 2s; transform-style : preserve-3d;} ";
        
        for( var i = 0; i < this.opts.videos.count; i++ ) {
            var degs = (i*deg_per_video)
            css = css +  "#" + this.opts.where.id + "-panel-" + i + " { -webkit-transform: rotateY("+ degs + "deg) translateZ(" + (this.opts.sizes.panel.width + 10) + "px); -moz-transform:" +
            "rotateY("+ degs + "deg) translateZ(" + (this.opts.sizes.panel.width + 10) + "px); -o-transform: rotateY("+ degs + "deg) translateZ(" + (this.opts.sizes.panel.width + 10) + "px); " +
            "transform: rotateY("+ degs + "deg) translateZ(" + (this.opts.sizes.panel.width + 10) + "px);} ";
        }
        
        return css;
    };
            
    utils.prototype.momentum =function (dist, time, maxDistUpper, maxDistLower, size) {
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
            
    utils.prototype.easeOutExpo = function (t, b, c, d) {
        return c - ((t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b);
    };
            
    utils.prototype.scrollSpecified = function(ele, change) {
        var element = $(ele);
        
        var degX = (Number(element.data('degX')) - change.x) % 360;
        var degY = (Number(element.data('degY')) - change.y) % 360;

        element.css3('transform','rotateY(' + degY + 'deg) rotateX(' + degX + 'deg)');

        element.data('degX', degX);
        element.data('degY', degY);
    };
    utils.prototype.scrollNormal = function( ele ) {
        var element = $(ele);

        var run = element.data('run');

        var degX = Number(element.data('degX'));
        var degY = Number(element.data('degY'));

        switch ( run ) {
            case 1:
                degY += this.opts.frameDistance;
                degY = degY % 360;
                element.css3('transform','rotateY(' + degY + 'deg)');
                break;
            case -1:
                degY -= this.opts.frameDistance;
                degY = degY % 360;
                element.css3('transform','rotateY(' + degY + 'deg)');
                break;
        }

        element.data('degX', degX);
        element.data('degY', degY);
                
        var that = this;
        setTimeout( function() {
            that.scrollNormal(ele);
        }, this.opts.frameLength);
            
    };
           
    utils.prototype.begin = function() {
        var that = this
        return function(data) {
            that.main(data);
        }
    };
    $.fn.ytgallery = function( playlist_id, options_in ) {
        var options = {};
        $.extend( options, settings, options_in );
        
        options.where = {
            id: this.attr('id'),
            ele: this
        };
        
        options.sizes.outer.width = this.innerWidth();
        options.sizes.outer.height = this.innerHeight();
       
        console.debug(options.where.id);
    
        $.ajax({
            context: self,
            success: function(opts) {
                return function(data) {
                    (new utils(opts)).main(data);
                };
            }(options),
            url: "https://gdata.youtube.com/feeds/api/playlists/"+ playlist_id+"?v=2&alt=jsonc"
        }); 
        return this;
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