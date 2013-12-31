/*
 * LMouseEventContainer.js
 **/
function $LMouseEventContainer(){
	var s = this;
	s.mouseDownContainer = [];
	s.mouseUpContainer = [];
	s.mouseMoveContainer = [];
};
$LMouseEventContainer.prototype = {
	addEvent:function(o,list,f){
		var s = this;
		if(s.hasEvent(o,list))return;
		list.push({container:o,listener:f});
	}
	,removeEvent:function(o,list,f){
		var s = this;
		for(var i=0,l=list.length;i<l;i++){
			if(list[i].container.objectIndex === o.objectIndex && (!f || list[i].listener == f)){
				list.splice(i,1);
				break;
			}
		}
	}
	,addMouseDownEvent:function(o,f){
		var s = this;
		s.addEvent(o,s.mouseDownContainer,f);
	}
	,addMouseUpEvent:function(o,f){
		var s = this;
		s.addEvent(o,s.mouseUpContainer,f);
	}
	,addMouseMoveEvent:function(o,f){
		var s = this;
		s.addEvent(o,s.mouseMoveContainer,f);
	}
	,addMouseEvent:function(o,t,f){
		var s = this;
		if(t == LMouseEvent.MOUSE_DOWN){
			s.addMouseDownEvent(o,f);
		}else if(t == LMouseEvent.MOUSE_UP){
			s.addMouseUpEvent(o,f);
		}else{
			s.addMouseMoveEvent(o,f);
		}
	}
	,hasEvent:function(o,list){
		for(var i=0,l=list.length;i<l;i++){
			if(list[i].container.objectIndex === o.objectIndex)return true;
		}
		return false;
	}
	,removeMouseDownEvent:function(o,f){
		var s = this;
		s.removeEvent(o,s.mouseDownContainer,f);
	}
	,removeMouseUpEvent:function(o,f){
		var s = this;
		s.removeEvent(o,s.mouseUpContainer,f);
	}
	,removeMouseMoveEvent:function(o,f){
		var s = this;
		s.removeEvent(o,s.mouseMoveContainer,f);
	}
	,removeMouseEvent:function(o,t,f){
		var s = this;
		if(t == LMouseEvent.MOUSE_DOWN){
			s.removeMouseDownEvent(o,f);
		}else if(t == LMouseEvent.MOUSE_UP){
			s.removeMouseUpEvent(o,f);
		}else{
			s.removeMouseMoveEvent(o,f);
		}
	}
	,dispatchMouseEvent:function(event,type){
		var s = this;
		if(type == LMouseEvent.MOUSE_DOWN){
			s.dispatchEvent(event,s.mouseDownContainer,LMouseEvent.MOUSE_DOWN);
		}else if(type == LMouseEvent.MOUSE_UP){
			s.dispatchEvent(event,s.mouseUpContainer,LMouseEvent.MOUSE_UP);
		}else{
			s.dispatchEvent(event,s.mouseMoveContainer,LMouseEvent.MOUSE_MOVE);
		}
	}
	,dispatchEvent:function(event,list,type){
		var self = this,sp,co,st=[],o;
		for(var i=0,l=list.length;i<l;i++){
			sp = list[i].container;
            if(!sp.mouseChildren || !sp.visible)continue;
			co = sp.getRootCoordinate();
			if(co.x <= event.offsetX && event.offsetX <= co.x + sp.getWidth() && co.y <= event.offsetY && event.offsetY <= co.y + sp.getHeight()){
				st.push({sp:sp,co:co,listener:list[i].listener});
			}
		}
		if(st.length == 0)return;
		if(st.length > 1){
			st = st.sort(self._sort);
		}
		o = st[0];
		event.clickTarget = o.sp;
		event.event_type = type;
		event.selfX = event.offsetX - o.co.x;
		event.selfY = event.offsetY - o.co.y;
		o.listener(event);
	}
	,set:function(t,v){
		LGlobal.mouseEventContainer[t] = v;
	}
	,_sort:function(a,b){
		var s = LMouseEventContainer,o1,o2,p;
		var al=s._getSort(a.sp),bl=s._getSort(b.sp);
		for(var i=0,l1=al.length,l2=bl.length;i<l1 && i<l2;i++){
			o1 = al[i],o2 = bl[i];
			if(o1.objectIndex == o2.objectIndex){
				p = o1;
				continue;
			}
			return o1.parent.getChildIndex(o1) < o2.parent.getChildIndex(o2);
		}
		return al.length < bl.length;
	}
	,_getSort:function(layer){
		var p = layer.parent,list=[layer];
		while(p != "root"){
	        list.unshift(p);
			p = p.parent;
		}
		return list;
	}
};
var LMouseEventContainer = new $LMouseEventContainer();
