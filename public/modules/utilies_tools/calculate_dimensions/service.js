myApp.registerFtr('calculate_dimensions_service', [
    'fRoot',
    function (fRoot) {
        var obj = {};
        obj.checkImageDimensions = function (files, width, height) {
            return new Promise((resolve, reject) => {
                let arrFail = [];
                let completed = 0;
                const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff', 'image/webp', 'image/x-icon', 'image/vnd.adobe.photoshop', 'image/heif', 'image/svg+xml'];

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const reader = new FileReader();

                    reader.onload = function (e) {
                        if (file.file.type === 'image/tiff') {
                            const tiffData = new DataView(e.target.result);
                            Tiff.initialize({TOTAL_MEMORY: 19777216 * 10});
                            const a = new Tiff({ buffer: tiffData.buffer });
                            var canvas = a.toCanvas();
                            const fileWidth = canvas.width;
                            const fileHeight = canvas.height;
                            if (fileWidth != width || fileHeight != height) {
                                arrFail.push(file.name);
                            }
                            completed++;
                            if (completed === files.length) {
                                resolve(arrFail);
                            }
                            a.close();
                        } else if (allowedMimeTypes.includes(file.file.type)) {
                            const img = new Image();
                            img.src = e.target.result;
                            img.onload = function (e) {
                                const fileWidth = img.width;
                                const fileHeight = img.height;
                                if (fileWidth != width || fileHeight != height) {
                                    arrFail.push(file.name);
                                }
                                completed++;
                                if (completed === files.length) {
                                    resolve(arrFail);
                                }
                            };
                        } else {
                            arrFail.push(file.name);
                            completed++;
                            if (completed === files.length) {
                                resolve(arrFail);
                            }
                        }
                    };

                    if (file.file.type === 'image/tiff') {
                        reader.readAsArrayBuffer(file.file);
                    } else {
                        reader.readAsDataURL(file.file);
                    }
                }
            });
        };

        return obj;
    },
]);
