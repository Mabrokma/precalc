/*

GRAPHING.js
===================

	This file contains the graphing engine, which is a function called, 'drawGraph'

*/

function drawGraph(wrapperID)
{
    // grab the plotOptions object
	plotOptions = this.plotOptions;

    // grab html options, or set defaults see: http://stackoverflow.com/questions/148901/is-there-a-better-way-to-do-optional-function-parameters-in-javascript
    var height = (typeof plotOptions.height === "undefined") ? 400 : plotOptions.height;
    var width = (typeof plotOptions.width === "undefined") ? 420 : plotOptions.width;
    var canvasID = (typeof plotOptions.id === "undefined") ? wrapperID.concat('GRAPH') : plotOptions.id;
    var tiksUseMathJax = (typeof plotOptions.tiksUseMathJax === "undefined") ? 1 : plotOptions.tiksUseMathJax;

    // set up the canvas as part of the div box node
    var canvas = document.createElement("canvas");
    canvas.setAttribute("id", canvasID);
    canvas.setAttribute("height", height+"px");
    canvas.setAttribute("width", width+"px");
    
    // grab the canvas wrapping div box
    var outnode = document.getElementById(wrapperID);
    outnode.style.width = width+"px";
    outnode.style.height = height+"px";

	if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
		width = canvas.width;
		height = canvas.height;

		// Draw frame round the canvas
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(width,0);
		ctx.lineTo(width,height);
		ctx.lineTo(0,height);
		ctx.lineTo(0,0);
	    // draw frame in black	
		ctx.strokeStyle = "Black";
		
		width -= 55;
		height -=40;
		
		// Leave enough space for the y-axis tick marks
        var hoffset = 45;
		ctx.translate(hoffset,9);
		
		// Draw boundary
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(width,0);
		ctx.lineTo(width,height);
		ctx.lineTo(0,height);
		ctx.lineTo(0,0);
		ctx.stroke();

		// Grid lines variables
		var yIncrement, y;
		var xIncrement, x;
	
        // axis variables (defaults given with ? *** )
        var xmin = (typeof plotOptions.xmin === "undefined") ? -10 : plotOptions.xmin;
        var xmax = (typeof plotOptions.xmax === "undefined") ? 10 : plotOptions.xmax;
        var xres = (typeof plotOptions.xres === "undefined") ? 1 : plotOptions.xres;
        var xlabel = (typeof plotOptions.xlabel === "undefined") ? "x" : plotOptions.xlabel;
        var xAxisStyle = (typeof plotOptions.xAxisStyle === "undefined") ? "<->" : plotOptions.xAxisStyle;

        var ymin = (typeof plotOptions.ymin === "undefined") ? -10 : plotOptions.ymin;
        var ymax = (typeof plotOptions.ymax === "undefined") ? 10 : plotOptions.ymax;
        var yres = (typeof plotOptions.yres === "undefined") ? 1 : plotOptions.yres;
        var ylabel = (typeof plotOptions.ylabel === "undefined") ? "y" : plotOptions.ylabel;
        var yAxisStyle = (typeof plotOptions.yAxisStyle === "undefined") ? "<->" : plotOptions.yAxisStyle;

        // domain variables: function is plotted from a to b
        var a = (typeof plotOptions.a === "undefined") ? 1 : plotOptions.a;
        var b = (typeof plotOptions.b === "undefined") ? 5 : plotOptions.b;

        // some checks on a and b to make sure they will fit on the axis
        if(a<xmin){ a = xmin;}
        if(b>xmax){ b = xmax;}

        // number of lines to be plotted (default is 1)
        var numberOfLines = (typeof plotOptions.numberOfLines === "undefined") ? 1 : plotOptions.numberOfLines;

		// Grid lines y direction
		yIncrement = height/(ymax-ymin)*yres;

		var thick = 0;
		if(Math.round(ymax/2)==ymax/2)
		{
			thick = 1; 
		}

		for(var i=0; i<=Math.ceil(height/yIncrement); i++)
		{
			y = (yres * i)*height/(ymax-ymin);	
		
			if(y<=(height))
			{
				ctx.beginPath();

				if(thick)
				{
					ctx.lineWidth = 1/4;
					thick = 0;		
				}
				else
				{
					ctx.lineWidth = 1/8;
					thick = 1;		
				}
		
				//ctx.lineWidth = 1/2;
				ctx.moveTo(0, y);
				ctx.lineTo(width, y);	
				ctx.stroke();
			}
		}

		// Grid lines x direction
		xIncrement = width/(xmax-xmin)*xres;

		var thick = 0;
		if(Math.round(xmin/2)==xmin/2)
		{
			thick = 1; 
		}

		for(var i=0; i<=Math.ceil(width/xIncrement); i++)
		{	
			ctx.beginPath();
	
			if(thick){
				ctx.lineWidth = 1/4;
				thick = 0;		
			} else {
				ctx.lineWidth = 1/8;
				thick = 1;		
			}

			//ctx.lineWidth = 1/2;
			x = (xres * i)*width/(xmax-xmin);	
			ctx.moveTo(x, 0);
			ctx.lineTo(x, height);	
			ctx.stroke();
		}

		// Find the origin
		var originY, originX;
		originY = height/(ymax-ymin)*ymax;
		originX = width/(xmax-xmin)*Math.abs(xmin);

		// Draw the y - axis
        // set the appropriate style from yaxisStyle
        var yAxisOptions = {};
        switch(yAxisStyle){
              // - no arrows
              case '-': yAxisOptions.which=0;
                            break;
              // -> arrows at one end
              case '->': yAxisOptions.which=1;
                            break;
              // <- arrows at one end
              case '<-': yAxisOptions.which=2;
                            break;
              // <-> arrows at both ends
              case '<-': yAxisOptions.which=3;
                            break;
        }
		ctx.beginPath();
		ctx.moveTo(originX,0);
		ctx.lineWidth = 2;
        if(xmin*xmax<=0 && yAxisStyle!='none'){
            drawArrow(ctx,originX,height,originX,0,yAxisOptions);
        }

		// Draw the x - axis
        // set the appropriate style from xAxisStyle
        var xAxisOptions = {};
        switch(xAxisStyle){
              // - no arrows
              case '-': xAxisOptions.which=0;
                            break;
              // -> arrows at one end
              case '->': xAxisOptions.which=1;
                            break;
              // <- arrows at one end
              case '<-': xAxisOptions.which=2;
                            break;
              // <-> arrows at both ends
              case '<-': xAxisOptions.which=3;
                            break;
        }
		ctx.beginPath();
		ctx.moveTo(0,originY);
		ctx.lineWidth = 2;
        if(xAxisStyle != 'none'){
            drawArrow(ctx,0,originY,width,originY,xAxisOptions);
        }

		// Set the origin as the reference point
		ctx.translate(originX,originY);

		// Draw the curve
		var x, y, deltax, gridpointX;

        // resolution of the curve
        var samples = (typeof plotOptions.samples === "undefined") ? 100 : plotOptions.samples;
		deltax = (b-a)/samples;

		// switch off vertical asymptotes by default
		vertAsymp = 0;
		
        // initialize the lineCount
        this.plotOptions.lineCount = 1;

        // plot however many functions there are
		for(j=0; j<numberOfLines; j++)
		{
		    // line colour 	
            var lineColour;
            if(typeof this.plotOptions.lineColours =='undefined') {
                lineColour = 'Red';
            } else {
                lineColour = (typeof this.plotOptions.lineColours[j] === "undefined") ? "Red" : this.plotOptions.lineColours[j];
            }
			ctx.strokeStyle = lineColour;
            
            // line style (solid, dashed, dotted, etc)
            var lineStyle;
            if(typeof this.plotOptions.lineStyles =='undefined') {
                lineStyle = 'solid';
            } else {
                lineStyle = (typeof this.plotOptions.lineStyles[j] === "undefined") ? "solid" : this.plotOptions.lineStyles[j];
            }

            switch(lineStyle)
            {
              // solid lines
              case 'solid': ctx.setLineDash([50000]);
                            break;
              // dashed lines: see http://www.rgraph.net/blog/2013/january/html5-canvas-dashed-lines.html
              case 'dashed': ctx.setLineDash([5]);
                             break;
              // dotted lines
              case 'dotted': ctx.setLineDash([1,2]);
                             break;
            }

            // line width (ultra thin, very thin, thin, normal, thick, very thick, ultra thick, etc)
            var lineWidth;
            if(typeof this.plotOptions.lineWidths =='undefined') {
                lineWidth = 'normal';
            } else {
                lineWidth = (typeof this.plotOptions.lineWidths[j] === "undefined") ? "normal" : this.plotOptions.lineWidths[j];
            }

            switch(lineWidth)
            {
              // ultra thin lines
              case 'ultra thin': ctx.lineWidth = .25;
                             break;
              // very thin lines
              case 'very thin': ctx.lineWidth = .5;
                             break;
              // thin lines
              case 'thin': ctx.lineWidth = 1;
                             break;
              // normal lines
              case 'normal': ctx.lineWidth = 2;
                             break;
              // thick lines
              case 'thick': ctx.lineWidth = 3;
                             break;
              // very thick lines
              case 'very thick': ctx.lineWidth = 4;
                             break;
              // ultra thick lines
              case 'ultra thick': ctx.lineWidth = 5;
                             break;
            }
	
            // parametric plots
            // parametric plots
            // parametric plots
			if(plotOptions.parametric==1)
			{
                var tmin = (typeof plotOptions.tmin === "undefined") ? 0 : plotOptions.tmin;
                var tmax = (typeof plotOptions.tmax === "undefined") ? (2*Math.PI) : plotOptions.tmax;
                var tstep = (typeof plotOptions.tstep === "undefined") ? 0.01 : plotOptions.tstep;
				samples = Math.ceil((tmax-tmin)/tstep);		

				ctx.beginPath();
				for(i=0; i<=(samples+1); i++)
				{
					t = tmin + i*tstep;
					var output = this.graphingFunction(t); 
                    x = output[0];
                    y = output[1];

					// get the unscaled x and y which we need to determine if (x,y) are outside of the viewing window
					xUnscaled = x;
					yUnscaled = y;
					
					// scale x and y
					y *= -height/(ymax-ymin);
					x *= width/(xmax-xmin);

					// check that the current point is in the viewing window
					if(yUnscaled<=ymax && yUnscaled>=ymin && xUnscaled>=xmin && xUnscaled <=xmax)		
					{
						ctx.lineTo(x,y);
					}
					
				}
				ctx.stroke();
			} else {

                // non-parametric curve
                // non-parametric curve
                // non-parametric curve
				ctx.beginPath();
				for(i=0; i<samples; i++)
				{
					x = a + deltax*i;	
					y = this.graphingFunction(x); 

					// discontinuities
					if(Math.abs(y)==Infinity || Math.abs(y)==NaN || (y>ymax && i>0 )|| (y<ymin && i>0))
					{
						if(i>0)
						{

							// store the old value of y
							yOld = y;
	
							// we determine the behaviour of y surrounding
							// the vertical asymptote by examining yPrevious
							if(yPrevious<0){
								y = ymin;
							} else if(yPrevious>0) {
								y = ymax;
							}		
	
							// need the unscaled version of y to make sure it doesn't go above the gridlines
							yUnscaled = y;

							// scale x and y
							y *= -height/(ymax-ymin);
							x *= width/(xmax-xmin);
					
							// end the current path before we cross the discontinuity
							if(alreadyReachedExtremePoint!=1)
							{
								ctx.lineTo(x,y);											
							}
							ctx.stroke();

							// begin a new path
							ctx.beginPath();
										
							if(yOld<0){
								y = ymin;
							} else if(yOld>0) {
								y = ymax;
							}
							y *= -height/(ymax-ymin);
							
							//ctx.lineTo(x,y);			
							
							vertAsymp = 1;
							yAsymptote = y;				
						}
					} else {
			
						yPrevious = y;
						
						// need the unscaled version of y to make sure it doesn't go above the gridlines
						yUnscaled = y;
						
						// scale x and y
						y *= -height/(ymax-ymin);
						x *= width/(xmax-xmin);
					
						if(yUnscaled<=ymax && yUnscaled>=ymin){			
							// if we've got
							//		ymin <= y <= ymax
							ctx.lineTo(x,y);	
							alreadyReachedExtremePoint = 0;							
							
							if(vertAsymp == 1){
								// draw a line to either ymin or ymax (determined above)
								ctx.lineTo(x,yAsymptote);
								
								// switch off vertical asymptotes
								vertAsymp = 0;
								
								// move back to beginning of the curve
								ctx.moveTo(x,y);
							}
						 } else {
							// if the graph starts off outside of the viewing window, then i=0 (first point on the graph)
							if(i==0)
							{
								alreadyReachedExtremePoint = 1;
							}
						
							// otherwise we are at the first occurence when the function goes out of the viewing window
							if(alreadyReachedExtremePoint !=1)
							{
								// determine if we're closer to ymin or ymax
								if(Math.abs(yUnscaled-ymin)<Math.abs(yUnscaled-ymax)){
									ctx.lineTo(x,ymin*(-height/(ymax-ymin)));
								} else {
									ctx.lineTo(x,ymax*(-height/(ymax-ymin)));
								}
							}
							alreadyReachedExtremePoint = 1;
						}
					}
				}
				ctx.stroke();
			}

			this.plotOptions.lineCount++;
		}


		// x and y tick marks
        if(tiksUseMathJax){
            // MathJax tick labels (drawn *on top* of the canvas)
            // MathJax tick labels (drawn *on top* of the canvas)
            // MathJax tick labels (drawn *on top* of the canvas)
            //
            // append canvas to the div box wrapper;
            // at this stage it contains the graph - we're 
            // going to add a series of other div boxes
            // on top using MathJax
            outnode.appendChild(canvas);

		    // y ticks
            var yticklabeldiv;
		    var axislabel = ymax;
		    for(i=0; i<=Math.ceil(height/yIncrement); i++)
		    {
                yticklabeldiv = document.createElement("div");
                yticklabeldiv.style.position = "absolute";
                yticklabeldiv.style.textAlign = "right";
                yticklabeldiv.style.width = "30px";
                yticklabeldiv.style.fontSize = "80%";
                yticklabeldiv.style.top = ""+i*yIncrement+"px";
                yticklabeldiv.innerHTML = "\\("+axislabel+"\\)";
                if(axislabel>=ymin && axislabel<=ymax){
                    outnode.appendChild(yticklabeldiv);
                }
		    	axislabel -= yres;
		    }

		    // x ticks
            var xticklabeldiv;
		    var axislabel = xmin;
		    for(i=0; i<=Math.ceil(width/xIncrement); i++)
		    {
                xticklabeldiv = document.createElement("div");
                xticklabeldiv.style.position = "absolute";
                xticklabeldiv.style.textAlign = "center";
                xticklabeldiv.style.width = "30px";
                xticklabeldiv.style.fontSize = "80%";
                if(axislabel<0){
                    xticklabeldiv.style.left = ""+(i*xIncrement+hoffset/2)+"px";
                } else {
                    xticklabeldiv.style.left = ""+(i*xIncrement+.7*hoffset)+"px";
                    xticklabeldiv.style.textAlign = "center";
                }
                xticklabeldiv.style.top = ""+(height+20)+"px";
                xticklabeldiv.innerHTML = "\\("+axislabel+"\\)";
                if(axislabel>=xmin && axislabel<=xmax){
                    outnode.appendChild(xticklabeldiv);
                }
		    	axislabel += xres;
		    }

            // x-label - need to check that the x-axis is in the current window
            var xlabeldiv;
            if(ymin*ymax<0){
                xlabeldiv = document.createElement("div");
                xlabeldiv.style.position = "absolute";
                xlabeldiv.style.fontSize = "80%";
                xlabeldiv.style.top = ""+(originY-10)+"px";
                xlabeldiv.style.right = ""+15+"px";
                xlabeldiv.innerHTML = "\\("+xlabel+"\\)";
                outnode.appendChild(xlabeldiv);
            }
            else if(ymin*ymax==0){
                xlabeldiv = document.createElement("div");
                xlabeldiv.style.position = "absolute";
                xlabeldiv.style.fontSize = "80%";
                xlabeldiv.style.top = ""+(height-10)+"px";
                xlabeldiv.style.right = ""+15+"px";
                xlabeldiv.innerHTML = "\\("+xlabel+"\\)";
                outnode.appendChild(xlabeldiv);
            }
            
            // y-label - need to check that the y-axis is in the current window
            var ylabeldiv;
            if(xmin*xmax<0){
                ylabeldiv = document.createElement("div");
                ylabeldiv.style.position = "absolute";
                ylabeldiv.style.fontSize = "80%";
                ylabeldiv.style.left = ""+(originX+hoffset+10)+"px";
                ylabeldiv.style.top = ""+15+"px";
                ylabeldiv.innerHTML = "\\("+ylabel+"\\)";
                outnode.appendChild(ylabeldiv);
            }
            else if(xmin*xmax==0){
                ylabeldiv = document.createElement("div");
                ylabeldiv.style.position = "absolute";
                ylabeldiv.style.fontSize = "80%";
                ylabeldiv.style.left = ""+(hoffset+10)+"px";
                ylabeldiv.style.top = ""+15+"px";
                ylabeldiv.innerHTML = "\\("+ylabel+"\\)";
                outnode.appendChild(ylabeldiv);
            }
        } else {
            // non-MathJax tick labels (part of the canvas)
            // non-MathJax tick labels (part of the canvas)
            // non-MathJax tick labels (part of the canvas)
            //
		    ctx.translate(-originX-15,-originY);
		    ctx.mozTextStyle = "9pt Arial";
	
		    // y ticks
		    var axislabel = ymax;
		    for(i=0; i<=Math.ceil(height/yIncrement); i++)
		    {
		    	ctx.fillStyle = "blue";
		    	ctx.fillText(axislabel,0,0);	
		    	ctx.translate(0, (yres)*height/(ymax-ymin));
		    	axislabel -= yres;
		    }
	
		    ctx.translate(0, -(yres)*height/(ymax-ymin));
		    
		    // x ticks
		    axislabel = xmin;
		    ctx.translate(10,15);
	
		    for(i=0; i<=Math.ceil(width/xIncrement); i++)
		    {
		    	ctx.fillStyle = "blue";
		    	ctx.fillText(axislabel,0,0);	
		    	ctx.translate((xres)*width/(xmax-xmin),0);
		    	axislabel += xres;
		    }
            // append canvas to the div box wrapper
            outnode.appendChild(canvas);
        }
	}
}


// stolen and tweaked from: http://www.dbp-consulting.com/tutorials/canvas/CanvasArrow.html
function drawArrow(ctx,x1,y1,x2,y2,options)
{
    // drawArrow(x1,y1,x2,y2,style,which,angle,length)
    //
    // sample usage (draws big arrows at either end of the line)
    // drawArrow(ctx,originX,0,originX,height,4,3,Math.PI/4,20);

    // x1,y1 - the line of the shaft starts here
    // x2,y2 - the line of the shaft ends here
    // style - type of head to draw
    //     0 - filled head with back a curve drawn with arcTo
    //     n.b. some browsers have an arcTo bug that make this look bizarre
    //     1 - filled head with back a straight line
    //     2 - unfilled but stroked head
    //     3 - filled head with back a curve drawn with quadraticCurveTo
    //     4 - filled head with back a curve drawn with bezierCurveTo
    //     function(ctx,x0,y0,x1,y1,x2,y2,style) - a function provided by the user to draw the head. Point (x1,y1) is the same as the end of the line, and (x0,y0) and (x2,y2) are the two back corners. The style argument is the this for the function. An example that just draws little circles at each corner of the arrow head is shown later in this document.
    // default 3 (filled head with quadratic back)
    // which - which end(s) get the arrow
    //     0 - neither
    //     1 - x2,y2 end
    //     2 - x1,y1 end
    //     3 - (that's 1+2) both ends
    // default 1 (destination end gets the arrow)
    // angle - the angle θ from shaft to one side of arrow head - default π/8 radians (22 1/2°, half of a 45°)
    // length - the distance d in pixels from arrow point back along the shaft to the back of the arrow head - default 10px


  'use strict';
  // Ceason pointed to a problem when x1 or y1 were a string, and concatenation
  // would happen instead of addition
  if(typeof(x1)=='string') x1=parseInt(x1);
  if(typeof(y1)=='string') y1=parseInt(y1);
  if(typeof(x2)=='string') x2=parseInt(x2);
  if(typeof(y2)=='string') y2=parseInt(y2);
  if(typeof(options) === "undefined"){ 
    var options = {};
  }

  var style = (typeof(options.style) === "undefined") ? 4 : options.style;
  var which = (typeof(options.which) === "undefined") ? 3 : options.which; // both ends by default
  var angle = (typeof(options.angle) === "undefined") ? Math.PI/8 : options.angle; 
  var d = (typeof(options.d) === "undefined") ? 10 : options.d; 
  // default to using drawHead to draw the head, but if the style
  // argument is a function, use it instead
  var toDrawHead=typeof(options.style)!='function'?drawHead:style;

  // For ends with arrow we actually want to stop before we get to the arrow
  // so that wide lines won't put a flat end on the arrow.
  //
  var dist=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
  var ratio=(dist-d/3)/dist;
  var tox, toy,fromx,fromy;
  if(which&1){
    tox=Math.round(x1+(x2-x1)*ratio);
    toy=Math.round(y1+(y2-y1)*ratio);
  }else{
    tox=x2;
    toy=y2;
  }
  if(which&2){
    fromx=x1+(x2-x1)*(1-ratio);
    fromy=y1+(y2-y1)*(1-ratio);
  }else{
    fromx=x1;
    fromy=y1;
  }

  // Draw the shaft of the arrow
  ctx.beginPath();
  ctx.moveTo(fromx,fromy);
  ctx.lineTo(tox,toy);
  ctx.stroke();

  // calculate the angle of the line
  var lineangle=Math.atan2(y2-y1,x2-x1);
  // h is the line length of a side of the arrow head
  var h=Math.abs(d/Math.cos(angle));

  if(which&1){	// handle far end arrow head
    var angle1=lineangle+Math.PI+angle;
    var topx=x2+Math.cos(angle1)*h;
    var topy=y2+Math.sin(angle1)*h;
    var angle2=lineangle+Math.PI-angle;
    var botx=x2+Math.cos(angle2)*h;
    var boty=y2+Math.sin(angle2)*h;
    toDrawHead(ctx,topx,topy,x2,y2,botx,boty,style);
  }
  if(which&2){ // handle near end arrow head
    var angle1=lineangle+angle;
    var topx=x1+Math.cos(angle1)*h;
    var topy=y1+Math.sin(angle1)*h;
    var angle2=lineangle-angle;
    var botx=x1+Math.cos(angle2)*h;
    var boty=y1+Math.sin(angle2)*h;
    toDrawHead(ctx,topx,topy,x1,y1,botx,boty,style);
  }
}

function drawHead(ctx,x0,y0,x1,y1,x2,y2,style)
{
  // draw the arrow heads
  'use strict';
  if(typeof(x0)=='string') x0=parseInt(x0);
  if(typeof(y0)=='string') y0=parseInt(y0);
  if(typeof(x1)=='string') x1=parseInt(x1);
  if(typeof(y1)=='string') y1=parseInt(y1);
  if(typeof(x2)=='string') x2=parseInt(x2);
  if(typeof(y2)=='string') y2=parseInt(y2);
  var radius=3;
  var twoPI=2*Math.PI;

  // all cases do this.
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x0,y0);
  ctx.lineTo(x1,y1);
  ctx.lineTo(x2,y2);
  switch(style){
    case 0:
      // curved filled, add the bottom as an arcTo curve and fill
      var backdist=Math.sqrt(((x2-x0)*(x2-x0))+((y2-y0)*(y2-y0)));
      ctx.arcTo(x1,y1,x0,y0,.55*backdist);
      ctx.fill();
      break;
    case 1:
      // straight filled, add the bottom as a line and fill.
      ctx.beginPath();
      ctx.moveTo(x0,y0);
      ctx.lineTo(x1,y1);
      ctx.lineTo(x2,y2);
      ctx.lineTo(x0,y0);
      ctx.fill();
      break;
    case 2:
      // unfilled head, just stroke.
      ctx.stroke();
      break;
    case 3:
      //filled head, add the bottom as a quadraticCurveTo curve and fill
      var cpx=(x0+x1+x2)/3;
      var cpy=(y0+y1+y2)/3;
      ctx.quadraticCurveTo(cpx,cpy,x0,y0);
      ctx.fill();
      break;
    case 4:
      //filled head, add the bottom as a bezierCurveTo curve and fill
      var cp1x, cp1y, cp2x, cp2y,backdist;
      var shiftamt=5;
      if(x2==x0){
	// Avoid a divide by zero if x2==x0
	backdist=y2-y0;
	cp1x=(x1+x0)/2;
	cp2x=(x1+x0)/2;
	cp1y=y1+backdist/shiftamt;
	cp2y=y1-backdist/shiftamt;
      }else{
	backdist=Math.sqrt(((x2-x0)*(x2-x0))+((y2-y0)*(y2-y0)));
	var xback=(x0+x2)/2;
	var yback=(y0+y2)/2;
	var xmid=(xback+x1)/2;
	var ymid=(yback+y1)/2;

	var m=(y2-y0)/(x2-x0);
	var dx=(backdist/(2*Math.sqrt(m*m+1)))/shiftamt;
	var dy=m*dx;
	cp1x=xmid-dx;
	cp1y=ymid-dy;
	cp2x=xmid+dx;
	cp2y=ymid+dy;
      }

      ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x0,y0);
      ctx.fill();
      break;
  }
  ctx.restore();
};
