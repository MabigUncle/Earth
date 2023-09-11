define(["./when-54c2dc71","./Check-6c0211bc","./Math-fc8cecf5","./Cartesian2-bddc1162","./Transforms-43808565","./RuntimeError-2109023a","./WebGLConstants-76bb35d1","./ComponentDatatype-6d99a1ee","./GeometryAttribute-49698167","./GeometryAttributes-4fcfcf40","./Plane-c946480f","./VertexFormat-7572c785","./FrustumGeometry-c6366133"],function(s,e,t,p,f,r,n,d,g,_,a,u,k){"use strict";var m=0,o=1;function h(e){var t,r,n=e.frustum,a=e.orientation,u=e.origin,i=s.defaultValue(e._drawNearPlane,!0);n instanceof k.PerspectiveFrustum?(t=m,r=k.PerspectiveFrustum.packedLength):n instanceof k.OrthographicFrustum&&(t=o,r=k.OrthographicFrustum.packedLength),this._frustumType=t,this._frustum=n.clone(),this._origin=p.Cartesian3.clone(u),this._orientation=f.Quaternion.clone(a),this._drawNearPlane=i,this._workerName="createFrustumOutlineGeometry",this.packedLength=2+r+p.Cartesian3.packedLength+f.Quaternion.packedLength}h.pack=function(e,t,r){r=s.defaultValue(r,0);var n=e._frustumType,a=e._frustum;return(t[r++]=n)===m?(k.PerspectiveFrustum.pack(a,t,r),r+=k.PerspectiveFrustum.packedLength):(k.OrthographicFrustum.pack(a,t,r),r+=k.OrthographicFrustum.packedLength),p.Cartesian3.pack(e._origin,t,r),r+=p.Cartesian3.packedLength,f.Quaternion.pack(e._orientation,t,r),t[r+=f.Quaternion.packedLength]=e._drawNearPlane?1:0,t};var l=new k.PerspectiveFrustum,y=new k.OrthographicFrustum,v=new f.Quaternion,F=new p.Cartesian3;return h.unpack=function(e,t,r){t=s.defaultValue(t,0);var n,a=e[t++];a===m?(n=k.PerspectiveFrustum.unpack(e,t,l),t+=k.PerspectiveFrustum.packedLength):(n=k.OrthographicFrustum.unpack(e,t,y),t+=k.OrthographicFrustum.packedLength);var u=p.Cartesian3.unpack(e,t,F);t+=p.Cartesian3.packedLength;var i=f.Quaternion.unpack(e,t,v),o=1===e[t+=f.Quaternion.packedLength];if(!s.defined(r))return new h({frustum:n,origin:u,orientation:i,_drawNearPlane:o});var c=a===r._frustumType?r._frustum:void 0;return r._frustum=n.clone(c),r._frustumType=a,r._origin=p.Cartesian3.clone(u,r._origin),r._orientation=f.Quaternion.clone(i,r._orientation),r._drawNearPlane=o,r},h.createGeometry=function(e){var t=e._frustumType,r=e._frustum,n=e._origin,a=e._orientation,u=e._drawNearPlane,i=new Float64Array(24);k.FrustumGeometry._computeNearFarPlanes(n,a,t,r,i);for(var o,c,s=new _.GeometryAttributes({position:new g.GeometryAttribute({componentDatatype:d.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:i})}),p=u?2:1,m=new Uint16Array(8*(1+p)),h=u?0:1;h<2;++h)c=4*h,m[o=u?8*h:0]=c,m[o+1]=c+1,m[o+2]=c+1,m[o+3]=c+2,m[o+4]=c+2,m[o+5]=c+3,m[o+6]=c+3,m[o+7]=c;for(h=0;h<2;++h)c=4*h,m[o=8*(p+h)]=c,m[o+1]=c+4,m[o+2]=c+1,m[o+3]=c+5,m[o+4]=c+2,m[o+5]=c+6,m[o+6]=c+3,m[o+7]=c+7;return new g.Geometry({attributes:s,indices:m,primitiveType:g.PrimitiveType.LINES,boundingSphere:f.BoundingSphere.fromVertices(i)})},function(e,t){return s.defined(t)&&(e=h.unpack(e,t)),h.createGeometry(e)}});
