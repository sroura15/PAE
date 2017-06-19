import { Input, Component, OnInit, ViewChild, ElementRef} from '@angular/core';

import { User, Tag, Coordenada, Reference, Map, rArea, FrontTag } from '../objects/index';
import { ReferenceService, UserService, TagService, ConversorService, MapService, RAreaService} from '../services/index';
import { OptionsComponent, NewMapComponent } from './index';

// Cargar fitxers
import {AccordionModule} from 'primeng/primeng';     //accordion and accordion tab
import {MenuItem} from 'primeng/primeng';            //api

import {FileUploadModule} from 'primeng/primeng'; 

@Component({
    selector:'canvas-component',
    moduleId: module.id,
    templateUrl: '../templates/home.component.html',

})

export class HomeComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
    maps: Map[];
    tags: Tag[];
    frontTags: FrontTag[];
    rAreas: rArea[];
    references: Reference[]=[];
    marks: Coordenada[]=[];
    actualMap: Map;
    defaultMap: Map;
    ref:Reference;
    push: boolean;
    hasMap: boolean;
    dor: boolean;
    count: number;
    //count2: number;
    radius: number;
    radius2: number;
    alertMessage:string;

    //Variables per probes
    probes: boolean=true;

    //Vars for SizeMapScale
    coS1:Coordenada;
    coS2:Coordenada;
    Scount:number=0;
    hypo:number=0;
    xdist:number=0;
    ydist:number=0;
    someoneInRArea:boolean;
    canvas:HTMLElement;

    //Vars for LAYERS VIEW
    layTagEmploy:boolean;
    layTagBox:boolean;
    layRestringed:boolean;
    layRefs:boolean;
    

    //Vars for Advanced menu options
    mapScaleActivated:boolean;
    mapReferencesActivated:boolean;
    mapaddRestringedAreaActivated:boolean;
    newMapForm:boolean;
    newRefInserted:boolean;
    barraOculta:boolean;
    editRefView:boolean;
    editTagsView:boolean;
    editRestringedView:boolean;


    @ViewChild('myCanvas') canvasRef:ElementRef;

    constructor(private userService: UserService, private refService: ReferenceService, private tagService: TagService, private mapService: MapService,  private conversorService: ConversorService, private rAreaService: RAreaService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.canvas = document.getElementById('map_view');
        this.dor=false;
        this.frontTags=[];
       // this.references=[];
        this.Scount=0;
        this.coS1 = new Coordenada();
        this.coS2 = new Coordenada();
        this.ref = new Reference();
        this.count=0;
        //this.count2=0;
        this.radius=0;
        this.radius2=40;
        this.push=true;
        this.hasMap=false;
        this.actualMap=new Map();
        this.actualMap.references=[];
        this.defaultMap=new Map();
        this.defaultMap.mapname="Soterrani C3";
        this.defaultMap.height=50;
        this.defaultMap.width=100;
        this.defaultMap.image="images/C3_3_gran.png";
        this.defaultMap.references=[];
        //this.defaultMap.scale=1;
        this.barraOculta=false;
        this.someoneInRArea=false;

        this.mapScaleActivated=false;
        this.mapReferencesActivated=false;
        this.mapaddRestringedAreaActivated=false;
        this.newMapForm=false;
        this.newRefInserted=false;
        this.alertMessage="";
        this.editRefView=false;
        this.editTagsView=false;
        this.editRestringedView=false;

        //Visualitzadors de capes
        this.layTagEmploy=true;
        this.layTagBox=true;
        this.layRestringed=true;
        this.layRefs=true;
    }

    ngOnInit() {
        this.createAndUpdateMap(this.defaultMap);
        this.getMaps();
        this.getRefs();
        this.getRAreas();
        this.loadAllUsers();
        this.paintLoop();       
    }

     paintLoop=()=> {

    // Paint current frame
  if (this.maps!=undefined){

    if(!this.hasMap){
      this.actualMap=this.maps[0];
      if(this.actualMap.scale==undefined){
        this.actualMap.scale=1;
      }
      this.hasMap=true;
    }
    
    if(this.editTagsView==false){this.getTags();}

    let ctx: CanvasRenderingContext2D=this.canvasRef.nativeElement.getContext('2d');
    ctx.clearRect(0,0,3840,2160);

    if(this.rAreas!= undefined&&(this.layRestringed||this.mapaddRestringedAreaActivated)){
      this.paintRArea(ctx);
    }
    
    if(this.tags!=undefined){
      this.paintTags(ctx);
    }

    if(this.mapReferencesActivated||this.layRefs){
      if(this.references!=undefined){
        this.paintReferences(ctx);
      }
    }

    if(this.mapaddRestringedAreaActivated||this.mapScaleActivated){
      if(this.marks!=undefined){
        this.paintMarkedLocation(ctx);
      }
    }

   }
    // Schedule next frame
    requestAnimationFrame(this.paintLoop);
 }

  paintTags(ctx: CanvasRenderingContext2D):void{  
    let inArea=false;
    
    for (let i=0 ; i < this.tags.length ; i++) {
      this.tags[i].tagIn=false;
      this.tags[i].dor=false;
      this.tags[i].countDor=0;

      if(this.rAreas[0]!=undefined){
        for(let j=0; j< this.rAreas.length; j++){
          let r=this.rAreaService.checkArea(this.tags[i], this.rAreas[j]);
          this.tags[i].dor=this.tags[i].dor || r;
          if (this.tags[i].dor&&this.tags[i].countDor==0){
            this.tags[i].tagIn=true;
            inArea=true;


            ctx.beginPath();
            //ctx.fillStyle= "rgba(200, 0, 0, 0.3)";
            let x = this.conversorService.xToPixels(this.tags[i].coorX, this.actualMap.width);
            let y = this.conversorService.yToPixels(this.tags[i].coorY, this.actualMap.height);
            this.radius=this.radius+2;
            ctx.moveTo(x+this.radius+20, y);
            ctx.ellipse(x, y, (20+this.radius), (10+this.radius), 0, 0, Math.PI*2);

            if (this.radius>=100){this.radius=0;}
            ctx.lineWidth=8;
            ctx.strokeStyle="rgba(200, 0, 0, 0.3)";
            ctx.stroke();
            //ctx.fill();

            ctx.beginPath();
            //ctx.fillStyle= "rgba(200, 0, 0, 0.3)";
            this.radius2++;
            ctx.moveTo(x+this.radius2-20, y);
            ctx.ellipse(x, y, (this.radius2-20), (this.radius2-30), 0, 0, Math.PI*2);
            if (this.radius2>=140){this.radius2=40;}
            ctx.lineWidth=8;
            ctx.strokeStyle="rgba(200, 0, 0, 0.3)";
            ctx.stroke();
            //ctx.fill();

            this.paintNonRestrictedTags(ctx, this.tags[i]);

            ctx.beginPath();
            ctx.fillStyle= 'red';

            ctx.font="50px Georgia";
            if(this.tags[i].tagname==""||this.tags[i].tagname==undefined){
              ctx.fillText(this.tags[i].idTag+" (Unsaved)", x-75, y-55);
            }
            else{
              ctx.fillText(this.tags[i].tagname, x-75, y-55);
            }
            //ctx.fill();
            this.tags[i].countDor++;
          }else if(this.tags[i].countDor==0){
            this.paintNonRestrictedTags(ctx, this.tags[i]);
            
          }
        }
        
      }else{
        this.paintNonRestrictedTags(ctx, this.tags[i]);
      }
    }
    this.someoneInRArea=inArea;
    console.log(this.someoneInRArea);
  }
  paintNonRestrictedTags(ctx: CanvasRenderingContext2D, tag: Tag): void{
    if(tag.tipoTag=="worker"&&this.layTagEmploy){
      let source=new Image();
      source.src="images/pos3.png";
      //source.offsetHeight=3;

      let x = this.conversorService.xToPixels(tag.coorX, this.actualMap.width);
      let y = this.conversorService.yToPixels(tag.coorY, this.actualMap.height);
      ctx.drawImage(source, x-70, y-50, 140, 100);

      ctx.beginPath();
      ctx.fillStyle= 'blue';
      ctx.font="50px Georgia";
      if(tag.tagname==""||tag.tagname==undefined)
        ctx.fillText(tag.idTag+" (Unsaved)", x-75, y-55);  
      else
        ctx.fillText(tag.tagname, x-75, y-55);
      
      ctx.fill();
    }else if(this.layTagBox&&tag.tipoTag!="worker"){
      let source=new Image();
      source.src="images/pos.png";
      //source.offsetHeight=3;

      let x = this.conversorService.xToPixels(tag.coorX, this.actualMap.width);
      let y = this.conversorService.yToPixels(tag.coorY, this.actualMap.height);
      ctx.drawImage(source, x-30, y-35, 60, 70);

      ctx.beginPath();
      ctx.fillStyle= 'black';
      ctx.font="50px Georgia";
      
      if(tag.tagname==""||tag.tagname==undefined){
        ctx.fillText(tag.idTag+" (Unsaved)", x-75, y-55);
      }
      else{
        ctx.fillText(tag.tagname, x-75, y-55);
      }
      ctx.fill();
    }
  }


  paintReferences(ctx: CanvasRenderingContext2D):void{
    
    for (let j=0; j<this.references.length; j++){
      ctx.beginPath();
      ctx.fillStyle= 'blue';
      let x= this.conversorService.xToPixels(this.references[j].coorX, this.actualMap.width);
      let y= this.conversorService.yToPixels(this.references[j].coorY, this.actualMap.height);
      ctx.moveTo(x, y-20);
      ctx.lineTo((x+30), (y+20));
      ctx.lineTo((x-30), (y+20));
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle= 'black';
      ctx.font="50px FontAwesome";
      let id=this.references[j].referencename;
      ctx.fillText("Ref: "+id, x-75, y-25);
      ctx.fill();
    }

  }

  paintRArea(ctx: CanvasRenderingContext2D):void{//classe de proba, es substituirà per una nova funció
    
    for (let j=0; j<this.rAreas.length; j++){
      ctx.beginPath();
      ctx.fillStyle = "rgba(0, 200, 0, 0.3)";
      let x=this.conversorService.xToPixels(this.rAreas[j].coorX, this.actualMap.width);
      let y=this.conversorService.yToPixels(this.rAreas[j].coorY, this.actualMap.height);
      let x2=this.conversorService.xToPixels(this.rAreas[j].coorX2, this.actualMap.width);
      let y2=this.conversorService.yToPixels(this.rAreas[j].coorY2, this.actualMap.height);
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x, y2);
      ctx.lineTo(x, y);
      ctx.lineWidth=5;
      ctx.stroke();
      ctx.fill();
    }
  }

  paintMarkedLocation(ctx: CanvasRenderingContext2D):void{

    for(let i=0; i<this.marks.length; i++){
    ctx.beginPath();
    let x=this.conversorService.xpercentToPixels(this.marks[i].x);
    let y=this.conversorService.ypercentToPixels(this.marks[i].y);
    ctx.moveTo(x-20, y-20);
    ctx.lineTo((x+20), (y+20));
    ctx.moveTo(x+20, y-20);
    ctx.lineTo((x-20), (y+20));
    ctx.lineWidth=10;
    ctx.strokeStyle = 'red';  
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle= 'black';
    ctx.font="50px FontAwesome";
    ctx.fillText("Mark "+i+1, x-75, y-30);
    ctx.fill();
    }
  }

//TAGS

  getTags(): void {
    this.tagService.getTags().subscribe( tags =>{ this.tags = tags});
  }

  createAndUpdateTag(tag: Tag): void{
    if(!tag){return;}
    this.tagService.createAndUpdate(tag).subscribe( tag => this.getTags());
  }

  deleteTag(tag: Tag): void{
    if(!tag){return;}
    if(this.tags.includes(tag)){this.tags.splice(this.tags.indexOf(tag),1);}
    this.tagService.delete(tag._id).subscribe(()=> this.tags = this.tags.filter(r =>r != tag));
  }

//MAPS
  getMaps(): void{
    this.mapService.getMaps().subscribe( maps => {this.maps=maps});
  }

  createAndUpdateMap(map: Map): void{
    if(!map){return;}
    this.mapService.createAndUpdate(map).subscribe(  map => this.getMaps());// ARREGLAR
  }

  deleteMap(map: Map): void{
    if(!map){return;}
    this.mapService.delete(map._id).subscribe(()=> this.maps = this.maps.filter(m =>m != map));

  }

  getMapById(id: string) {
    this.mapService.getMapById(id).subscribe(map => { this.actualMap = map; });
  }

//REFERENCES
  getRefs(): void{
    this.refService.getReferences().subscribe( refs => {this.references =refs});
  }

  createAndUpdateRef(ref: Reference): void{
    if(!ref){return;}
    
    this.refService.createAndUpdate(ref).subscribe(res=>this.getRefs());
  }

  deleteRef(ref: Reference): void{
    if(!ref){return;}
    if(this.references.includes(ref)){this.references.splice(this.references.indexOf(ref),1);}
    this.refService.delete(ref._id).subscribe(()=> this.references = this.references.filter(r =>r != ref));

  }

//USERS

  deleteUser(id:number) {
    this.userService.delete(id).subscribe(() => { this.loadAllUsers() });
  }

  private loadAllUsers() {
    this.userService.getAll().subscribe(users => { this.users = users; });
  }

//RESTRICTED AREAS

  getRAreas(): void{
    this.rAreaService.getRAreas().subscribe( rAreas => {this.rAreas=rAreas});
  }

  createAndUpdateRArea(rArea: rArea): void{
    if(!rArea){return;}
    this.rAreaService.createAndUpdate(rArea).subscribe( rArea => this.getRAreas());
  }


  deleteRArea(rArea: rArea): void{
    if(!rArea){return;}
    if(this.rAreas.includes(rArea)){this.rAreas.splice(this.rAreas.indexOf(rArea),1);}
    this.rAreaService.delete(rArea._id).subscribe(()=> this.rAreas = this.rAreas.filter(r =>r != rArea));

  }

    //GET CURSOR POSITION *IN PIXELS* ON MAP

    saveRefParams(id:string,height:number){
        
        if((id.length==0)||(height==null)||(height==0)){
    
          this.alertMessage=" ¡Define it! You have to save this Reference to go on.";
        
        }else{
          this.ref.referencename=id;
          this.ref.coorZ=height;
          this.ref.map=this.actualMap._id;

          this.createAndUpdateMap(this.actualMap);
          //this.refPush(this.ref);
          this.createAndUpdateRef(this.ref);
          //this.getRefs();
          this.hasMap==false;
          this.newRefInserted=false;
          this.alertMessage=""
          console.log("number "+id+" , height: "+height)
        }
     }
    

    public getCursorPosition(event:MouseEvent) {


        if(this.mapScaleActivated){
            //FUNCIÓ PER A GET SCALE

            this.Scount++;

            var x = event.offsetX; 
            var y = event.offsetY;  

            var sizePix = event.srcElement.parentElement.offsetWidth;
            var sizePiy = event.srcElement.parentElement.offsetHeight;

            console.log("x: " + x + " y: " + y +' Pic. Actual Size X: '+sizePix+" Pic. Actual Size Y:" +sizePiy+" Count>> "+ this.Scount);


            var percentx= x/sizePix;
            var percenty= y/sizePiy;

            if(this.Scount==1){
                this.coS1.writeXY(percentx,percenty);
                this.marks[0]=new Coordenada();
                this.marks[0].writeXY(percentx, percenty);                 
            }

            else if(this.Scount==2){

                this.actualMap.scale=sizePix/sizePiy;

                this.coS2.writeXY(percentx,percenty);

                this.xdist=Math.abs(this.coS2.x-this.coS1.x);
                this.ydist=Math.abs(this.coS2.y-this.coS1.y);
                this.hypo=Math.hypot(this.xdist,this.ydist);
                this.marks[1]=new Coordenada();
                this.marks[1].writeXY(percentx, percenty);
                // Aquí agafo/demano el valor indrotuit en el formulari, per executar sendScale()
            }
        }

        else if(this.mapReferencesActivated&&(!this.newRefInserted)){
            // INTERFICIE PER AGREGAR REFERENCIES 
            
            var x = event.offsetX; 
            var y = event.offsetY;  

            var sizePix = event.srcElement.parentElement.offsetWidth;
            var sizePiy = event.srcElement.parentElement.offsetHeight;

            console.log("x: " + x + " y: " + y +' Pic. Actual Size X: '+sizePix+" Pic. Actual Size Y:" +sizePiy+" REF ");

            this.ref = new Reference();
            this.ref.coorX= this.conversorService.xpercentToX(x/sizePix, this.actualMap.width);
            this.ref.coorY= this.conversorService.xpercentToY(y/sizePiy, this.actualMap.height);

            this.newRefInserted=true;  // And here is time to go to html refered          
        }else if(this.mapaddRestringedAreaActivated){

          var mark:Coordenada=new Coordenada();

          var x = event.offsetX; 
          var y = event.offsetY;  

          var sizePix = event.srcElement.parentElement.offsetWidth;
          var sizePiy = event.srcElement.parentElement.offsetHeight;

          console.log("x: " + x + " y: " + y +' Pic. Actual Size X: '+sizePix+" Pic. Actual Size Y:" +sizePiy+" RAREA ");

          mark.writeXY(x/sizePix, y/sizePiy);

          this.marks.push(mark);

          if(this.marks.length>=2){
            var rArea1: rArea=new rArea();
            //this.count2++;
            rArea1.areaname="New Area";
            rArea1.coorX=this.conversorService.xpercentToX(this.marks[0].x, this.actualMap.width);
            rArea1.coorY=this.conversorService.xpercentToY(this.marks[0].y, this.actualMap.height);
            rArea1.coorX2=this.conversorService.xpercentToX(this.marks[1].x, this.actualMap.width);
            rArea1.coorY2=this.conversorService.xpercentToY(this.marks[1].y, this.actualMap.height);
            this.rAreas.push(rArea1);
            this.createAndUpdateRArea(rArea1);
            this.marks=[];      
          }

        }

    }

    public sendScale(resp:number){
        if(this.xdist>=this.ydist){

            this.actualMap.width=(this.xdist*resp/this.hypo)/this.xdist;
            this.actualMap.height=this.actualMap.width/this.actualMap.scale;

        }else{
            this.actualMap.height=(this.ydist*resp/this.hypo)/this.ydist;
            this.actualMap.width=this.actualMap.height*this.actualMap.scale;
        }

        this.createAndUpdateMap(this.actualMap);
        this.mapScaleActivated=false;   
        this.Scount=0;
        console.log("Altura planol metres: "+this.actualMap.height+"  Ample planol metres: "+this.actualMap.width);
    }

// MENUS FUNCTIONS

    public cancelScale(){
        this.mapScaleActivated=false;   
        this.Scount=0;
    }

    closeNewMapMenu(){
        this.newMapForm=false;
    }

    openNewMapMenu(){
        this.newMapForm=true;
    }

//FUNCIONS PER MANAGEMENT BOTTONS
    public mapScale(e:EventTarget){
        this.marks=[];
        if(this.mapScaleActivated){
            this.mapScaleActivated=false;
            this.Scount=0;
        }
        else{
            this.Scount=0;
            this.mapScaleActivated=true;
            this.mapaddRestringedAreaActivated=false;
            this.mapReferencesActivated=false;
        }
    }


    public mapReferences(e:Event){
        this.marks=[];
        if(this.mapReferencesActivated){
            this.getRefs();
            this.mapReferencesActivated=false;
        }
        else{
            this.getRefs();
            this.mapReferencesActivated=true;
            this.mapScaleActivated=false;
            this.mapaddRestringedAreaActivated=false;
        }
    }

    public addRestringedArea(e:EventTarget){
        this.marks=[];
        if(this.mapaddRestringedAreaActivated){
            this.mapaddRestringedAreaActivated=false;
        }
        else{
            this.mapaddRestringedAreaActivated=true;
            this.mapReferencesActivated=false;
            this.mapScaleActivated=false;

        }
    }

    color(b:boolean):string{
        if(b==true){
            return "#6ebf32";
        }else{
            return "#f56a6a";
        }}

    ocultarBarra(b:boolean):string{
        if(b==true){
            return "-24em";
        }else{
            return "auto";
        }}

    clicked():void { 
        this.barraOculta=!this.barraOculta;} 

    goToEditRefView():void {
        this.marks=[];
        this.editRefView=!this.editRefView;} 

    goToEditTagsView():void {
        this.marks=[];
        this.editTagsView=!this.editTagsView;}

    goToEditRestringedView():void {
        this.marks=[];
      //console.log("burro");
        this.editRestringedView=!this.editRestringedView;}     


    modifyTagType(tag:Tag):void{
        if(tag.tipoTag=="box"||tag.tipoTag=="")
          tag.tipoTag="worker";
        else
          tag.tipoTag="box"; 

        this.createAndUpdateTag(tag);
    }


}

      
