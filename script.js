
        function startScanner() {
            Quagga.init({
                inputStream: {
                    type: "LiveStream",
                    target: document.querySelector('#scanner'),
                    constraints: {
                        width: { min: 640 },
                        height: { min: 480 },
                        facingMode: "environment",
                        aspectRatio: { min: 1, max: 2 }
                    }
                },
                locator: {
                    patchSize: "medium",
                    halfSample: true
                },
                numOfWorkers: navigator.hardwareConcurrency || 4,
                decoder: {
                    readers: [
                        "code_128_reader",
                        "ean_reader",
                        "ean_8_reader",
                        "upc_reader",
                        "upc_e_reader"
                    ]
                },
                locate: true
            }, function (err) {
                if (err) {
                    console.error("Erreur d'initialisation :", err);
                    alert("Erreur lors de l'accès à la caméra. Vérifiez les permissions.");
                    return;
                }
                Quagga.start();
                console.log("Scanner démarré !");
            });

            Quagga.onDetected(function (result) {
                if (result && result.codeResult && result.codeResult.code) {
                    const code = result.codeResult.code;
                    document.getElementById('result').innerText = "✅ Code scanné : " + code;
                    Quagga.offDetected(); // Stop detection temporairement
                    Quagga.stop();        // Stop caméra

                    // Redémarrage automatique après 3 secondes
                    setTimeout(() => {
                        document.getElementById('result').innerText = "En attente de scan...";
                        startScanner();
                    }, 3000);
                }
            });
        }

        window.addEventListener('load', function () {
            // Vérifie si HTTPS est actif (obligatoire sur mobile)
            if (location.protocol !== 'https:') {
                alert("⚠️ Le scan ne fonctionne que via HTTPS sur mobile.");
            } else {
                startScanner();
            }
        });
    