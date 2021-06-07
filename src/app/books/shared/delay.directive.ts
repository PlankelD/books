import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[bmDelay]'
})
export class DelayDirective implements OnInit{

  //EinblendeZeit als Argument an die Derective übergeben. Hier empfange ich den Wert
  @Input() bmDelay: number
  constructor(private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void{
    setTimeout(()=> {
      this.viewContainerRef.createEmbeddedView(this.templateRef)
    },this.bmDelay)
  }
}
