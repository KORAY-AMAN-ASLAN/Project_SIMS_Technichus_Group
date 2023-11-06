<!DOCTYPE html>
<html lang="sv">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="CSS/stilmall.css" />
    <meta charset="utf-8">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	
</head>
<body>

	<!-- Övre fältet som innehåller språkval -->
    <div class="top-menu">
        <?php
        include "NavBar.php"
        ?> 
    </div>
	
	
    <div class="container">
        <main>
		
		
            <section id="interactive-content">
			
				<!-- Varje planet har sin egen div kontainer -->
                <div class="planet-container" id="earth-container">
                    <div id="earth-icon"></div>
                </div>
				
                <div class="planet-container" id="mars-container">
                    <div  id="mars-icon"></div>
                </div>
				
            </section>
			
			
            <section id="information-box">
                <h2>Planet Information</h2>
                <div id="planet-info">
                    <p>Everything physical in the universe, just like you and me, is made of matter. The amount of matter is given as the mass of an object, and we measure the mass of an object in kilograms. When we usually talk about kilograms, we use the unit to describe how heavy something is, and somewhat simplified, we use the unit to talk about how much we have to take in to lift something off the ground. Try lifting the milk pie yourself below and try to draw a conclusion based on the sizes of the planets. What did you come up with? Where is gravity greatest?</p>
                </div>
            </section>
			
			
        </main>
    </div>
	
	
	
	
    <script>
        const earthContainer = document.getElementById("earth-container");
        const marsContainer = document.getElementById("mars-container");
		
		<!-- Läsa in elementen för att ändra deras storlekar vid klick event -->
        const earthIcon = document.getElementById("earth-icon");
        const marsIcon = document.getElementById("mars-icon");
		
        const desiredSizeEarth = "600px"; // hur mycket planeten ska expanderas
        const desiredSizeMars = "800px";
		
		<!-- läsa in informationen för ändring beroende på planet som klickas etc --> 
        const planetInfo = document.getElementById("planet-info");
		
		<!-- Sätter custom texter när det sker switches -->
        const earth = "Planet earth";
        const mars = "Planet mars";
        const solarSystem = "Our solarsystem";
		
		<!-- olika villkor -->
        let isEarthExpanded = false;
        let isMarsExpanded = false;

        function expandEarth() {
            earthIcon.style.transform = `scale(${parseFloat(desiredSizeEarth) / 100}) translateX(10px)`;
            earthIcon.style.zIndex = 2; // skicka jorden framåt
            planetInfo.innerHTML = "This is where you live.";
            document.querySelector("#information-box h2").textContent = earth;
            isEarthExpanded = true;
            isMarsExpanded = false;
            marsIcon.style.zIndex = 1; // Skicka mars bakåt
        }

        function expandMars() {
            marsIcon.style.transform = `scale(${parseFloat(desiredSizeMars) / 100}) translateX(0px)`; // övergår mjukt till större planet.
            marsIcon.style.zIndex = 2; // hämtar fram Mars ett steg före i z-led
            planetInfo.innerHTML = "This is where you don't live.";
            document.querySelector("#information-box h2").textContent = mars;
            isMarsExpanded = true;
            isEarthExpanded = false;
            earthIcon.style.zIndex = 1; // skickar tillbaka jorden i z-led.
        }

		<!-- Funktion som minimerar planeterna och visar relevant text i info panelen -->
        function collapsePlanets() {
            if (isEarthExpanded) {
                earthIcon.style.transform = `scale(1) translateX(0)`;
				planetInfo.innerHTML = "Everything physical in the universe, just like you and me, is made of matter. The amount of matter is given as the mass of an object, and we measure the mass of an object in kilograms. When we usually talk about kilograms, we use the unit to describe how heavy something is, and somewhat simplified, we use the unit to talk about how much we have to take in to lift something off the ground. Try lifting the milk pie yourself below and try to draw a conclusion based on the sizes of the planets. What did you come up with? Where is gravity greatest?";
				document.querySelector("#information-box h2").textContent = solarSystem;
                isEarthExpanded = false;
            }
            if (isMarsExpanded) {
                marsIcon.style.transform = `scale(1) translateX(0)`;
				planetInfo.innerHTML = "Everything physical in the universe, just like you and me, is made of matter. The amount of matter is given as the mass of an object, and we measure the mass of an object in kilograms. When we usually talk about kilograms, we use the unit to describe how heavy something is, and somewhat simplified, we use the unit to talk about how much we have to take in to lift something off the ground. Try lifting the milk pie yourself below and try to draw a conclusion based on the sizes of the planets. What did you come up with? Where is gravity greatest?";
				document.querySelector("#information-box h2").textContent = solarSystem;
                isMarsExpanded = false;
            }
        }

        // Add click event listeners
        earthContainer.addEventListener("click", function (event) {
            if (!isEarthExpanded) {
                expandEarth();
                event.stopPropagation(); // för att undvika att klick händelsen fortsätter till window som lyssnar i hela fönstret (föräldern).
            }
        });

        marsContainer.addEventListener("click", function (event) {
            if (!isMarsExpanded) {
                expandMars();
                event.stopPropagation();
            }
        });

        // Minimerar planeterna om klick utanför planeternas kontainer
        window.addEventListener("click", function () {
            collapsePlanets();
        });
		
    </script>
	
</body>
</html>
