$(function(){// Dimension Settings set the scene size


  if ($('#second').hasClass('item')) {

var container, stats;
      var camera, scene, renderer;
      var uniforms;
      init();
      animate();
      function init() {
        container = document.getElementById( 'container2' );
        camera = new THREE.Camera();
        camera.position.z = 1;
        scene = new THREE.Scene();
        var geometry = new THREE.PlaneBufferGeometry( 5, 2 );
        uniforms = {
          time: { type: "f", value: 1.0 },
          resolution: { type: "v2", value: new THREE.Vector2() }
        };
        var material = new THREE.ShaderMaterial( {
          uniforms: uniforms,
          vertexShader: document.getElementById( 'vertexShader' ).textContent,
          fragmentShader: document.getElementById( 'fragmentShader' ).textContent
        } );
        var mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );
        renderer = new THREE.WebGLRenderer();
        container.appendChild( renderer.domElement );
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        container.appendChild( stats.domElement );
        onWindowResize();
        window.addEventListener( 'resize', onWindowResize, false );
      }
      function onWindowResize( event ) {
        uniforms.resolution.value.x = window.innerWidth;
        uniforms.resolution.value.y = window.innerHeight;
        renderer.setSize( window.innerWidth, window.innerHeight );
      }
      //
      function animate() {
        requestAnimationFrame( animate );
        render();
        stats.update();
      }
      function render() {
        analyser.getByteFrequencyData(dataArray);
        analyser.getByteTimeDomainData(timeDomain);

        uniforms.time.value += dataArray[0]/1000 + 0.1;
        renderer.render( scene, camera );
      }

    }
  });
