var camera, scene, renderer;
      init();
      animate();
      function init() {
        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.set( 0, 75, 100 );
        scene = new THREE.Scene();
        var geometry = new THREE.PlaneBufferGeometry( 100, 100 );
        var texture = new THREE.Texture( generateTexture() );
        texture.needsUpdate = true;
        for ( var i = 0; i < 15; i ++ ) {
          var material = new THREE.MeshBasicMaterial( {
            color: new THREE.Color().setHSL( 0.3, 3.75, ( i / 15 ) * 0.4 + 0.1 ),
            map: texture,
            depthTest: false,
            depthWrite: false,
            transparent: true
          } );
          var mesh = new THREE.Mesh( geometry, material );
          mesh.position.y = i * 0.25;
          mesh.rotation.x = - Math.PI / 2;
          scene.add( mesh );
        }
        scene.children.reverse();
        renderer = new THREE.WebGLRenderer();
        renderer.sortObjects = false;
        renderer.setClearColor( 'black' );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
        //
        window.addEventListener( 'resize', onWindowResize, false );
      }
      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
      }
      function generateTexture() {
        var canvas = document.createElement( 'container2' );
        canvas.width = 512;
        canvas.height = 512;
        var context = canvas.getContext( '2d' );
        for ( var i = 0; i < 20000; i ++ ) {
          context.fillStyle = 'hsl(0,0%,' + ( Math.random() * 50 + 50 ) + '%)';
          context.beginPath();
          context.arc( Math.random() * canvas.width, Math.random() * canvas.height, Math.random() + 0.15, 0, Math.PI * 2, true );
          context.fill();
        }
        context.globalAlpha = 0.075;
        context.globalCompositeOperation = 'lighter';
        return canvas;
      }
      //
      function animate() {
        requestAnimationFrame( animate );
        render();
      }
      function render() {
        analyser.getByteFrequencyData(dataArray);
        analyser.getByteTimeDomainData(timeDomain);
        var time = Date.now() / 6000;
        camera.position.x = 80 * Math.cos( time );
        camera.position.z = 80 * Math.sin( time );
        camera.lookAt( scene.position );
        for ( var i = 0, l = scene.children.length; i < l; i ++ ) {
          var mesh = scene.children[ i ];
          mesh.material.color.setHSL( dataArray[i]/1000 * 10 , 3.75, ( i / 15 )),
          mesh.position.x = Math.sin( time * 4 ) * i * i * 0.005;
          mesh.position.y = i * dataArray[0]/100 ;
          mesh.position.z = Math.cos( time * 6 ) * i * dataArray[0]/1000;
        }
        renderer.render( scene, camera );
      }