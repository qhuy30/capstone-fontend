myApp.registerFtr("training_details_service", [
    "fRoot", '$filter',
    function (fRoot, $filter) {
        var obj = {};

        obj.loadDetails = function (id) {
            return fRoot.requestHTTP({
                url: BackendDomain + "/education/training_point/loadDetails",
                method: "POST",
                data: JSON.stringify({ id }),
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json;odata=verbose",
                },
            });
        };

        obj.getQRCode = function (id, type) {
            return fRoot.requestHTTP({
                url: BackendDomain + "/education/training_point/getQRCode",
                method: "POST",
                data: JSON.stringify({ id, type }),
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json;odata=verbose",
                },
            });
        };

        obj.ackTrainingEvent = function (id, studentId, type) {
            return fRoot.requestHTTP({
                url: BackendDomain + "/education/training_point/ackTrainingEvent",
                method: "POST",
                data: JSON.stringify({ id, studentId, type }),
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json;odata=verbose",
                },
            });
        };

        obj.export_checkout_list = function (id) {
            return fRoot.requestHTTP({
                url: BackendDomain + "/education/training_point/exportCheckoutList",
                method: "POST",
                data: JSON.stringify({ id }),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json;odata=verbose"
                }
            });
        }

        function autoFixWidthToExportExcel(ws) {
            const columnRange = XLSX.utils.decode_range(ws['!ref']);
            for (let col = columnRange.s.c; col <= columnRange.e.c; col++) {
                let maxLength = 0;
                for (let row = columnRange.s.r; row <= columnRange.e.r; row++) {
                    const cell = ws[XLSX.utils.encode_cell({ r: row, c: col })];
                    const cellValue = cell ? cell.v.toString() : '';
                    if (cellValue.length > maxLength) {
                        maxLength = cellValue.length;
                    }
                }
                const columnWidth = maxLength > 5 ? maxLength + 1 : 5;
                ws['!cols'] = ws['!cols'] || [];
                ws['!cols'][col] = { width: columnWidth };
            }
            return ws;
        }

        obj.exportCheckOutListToExcelFile = function ({ title, trainingPoint, checkoutList }) {
            let reportInput = []
            for (let i in checkoutList) {
                reportInput.push({});
                reportInput[i]['#'] = parseInt(i) + 1;
                reportInput[i][$filter('l')('StudentId')] = checkoutList[i].studentId;
                reportInput[i][$filter('l')('FullName')] = checkoutList[i].studentName;
                reportInput[i][$filter('l')('ClassId')] = checkoutList[i].classStudentId;
                reportInput[i][$filter('l')('StudyProgramId')] = checkoutList[i].studyProgramId;
                reportInput[i][$filter('l')('CourseTime')] = checkoutList[i].courseTime;
                reportInput[i][$filter('l')('RegisterDate')] = checkoutList[i].registeredDate;
                reportInput[i][$filter('l')('Time') + ' Check-In'] = checkoutList[i].checkedInDate;
                reportInput[i][$filter('l')('Time') + ' Check-Out'] = checkoutList[i].checkedOutDate;
                reportInput[i][$filter('l')('TrainingPoint')] = trainingPoint;
            }

            console.log(reportInput);

            let ws = XLSX.utils.json_to_sheet(reportInput, {
                header: [
                    '#',
                    $filter('l')('StudentId'),
                    $filter('l')('FullName'),
                    $filter('l')('ClassId'),
                    $filter('l')('StudyProgramId'),
                    $filter('l')('CourseTime'),
                    $filter('l')('RegisterDate'),
                    $filter('l')('Time') + ' Check-In',
                    $filter('l')('Time') + ' Check-Out',
                    $filter('l')('TrainingPoint'),
                ]
            });

            // auto fix width of the column with content
            ws = autoFixWidthToExportExcel(ws);

            const wb = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(wb, ws, $filter('l')('ParticipantList'));
            var excelData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

            var blob = new Blob([excelData], { type: 'application/octet-stream' });
            var url = URL.createObjectURL(blob);

            var link = document.createElement('a');
            link.href = url;
            link.download = `${title}_checkout.xlsx`;
            link.click();

            URL.revokeObjectURL(url);
        }

        return obj;
    },
]);
