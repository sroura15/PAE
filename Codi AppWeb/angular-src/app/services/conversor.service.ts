import { Tag, Map } from '../objects/index';

export class ConversorService{

  //Transforms from meters to canvas pixels
    xToPixels(x: number, mapWidth: number): number{ //(meters, canvas pixels)
        var cx=(x/mapWidth)*3840;
        return cx;
      }

      yToPixels(y:number, mapHeight: number): number{ //(meters, canvas pixels)
          var cy=(y/mapHeight)*2160;
          return cy;
      }

    //Transforms from image pixels to meters
      xtoMeters(x:number, mapWidth: number, imageWidth: number): number{ //(pixels, meters, pixels)
          var mx= mapWidth*(x/imageWidth);
          return mx;
      }

      ytoMeters(y:number, mapWidth: number, imageWidth: number): number{ //(pixels, meters, pixels)
          var my= mapWidth*(y/imageWidth);
          return my;
      }

    //Transforms from % of the image to canvas pixels
      xpercentToPixels(xp:number):number{ //(percentage)
          var cx= xp*3840;
          return cx;
      }

      ypercentToPixels(yp:number):number{ //(percentage)
          var cy= yp*2160;
          return cy;
      }

      //Transforms from % to meters
      xpercentToX(x: number, mapWidth: number): number{ //(meters, canvas pixels)
        var cx=this.xpercentToPixels(x);
        var dx=(cx*mapWidth)/3840;
        return dx;
      }

      xpercentToY(y:number, mapHeight: number): number{ //(meters, canvas pixels)
        var cy=this.ypercentToPixels(y);
        var dy=(cy*mapHeight)/2160;
        return dy;      
      }

      twoDecimals(n:number):number{
          return (Math.round(n*100)/100)
      }

}