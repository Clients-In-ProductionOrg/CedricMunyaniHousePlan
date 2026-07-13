document.addEventListener('DOMContentLoaded', function () {
    initFloorDescriptionToggle();
    initUploadProgress();
});

function initFloorDescriptionToggle() {
    const floorFields = [
        'first_floor_description',
        'second_floor_description',
        'third_floor_description',
        'fourth_floor_description',
        'fifth_floor_description',
        'sixth_floor_description',
        'seventh_floor_description',
        'eighth_floor_description',
        'ninth_floor_description',
        'tenth_floor_description',
    ];

    const rows = floorFields
        .map((fieldName) => document.querySelector('.form-row.field-' + fieldName))
        .filter((row) => row);

    if (rows.length === 0) {
        return;
    }

    rows.forEach((row) => {
        row.style.display = 'none';
    });

    const insertionTarget = document.querySelector('.form-row.field-description') || rows[0];
    if (!insertionTarget || !insertionTarget.parentNode) {
        return;
    }

    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'form-row';
    buttonWrapper.style.paddingTop = '8px';

    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'button';
    addButton.textContent = 'ADD NEW Floor';

    buttonWrapper.appendChild(addButton);
    insertionTarget.parentNode.insertBefore(buttonWrapper, insertionTarget.nextSibling);

    const updateButtonState = () => {
        const hiddenRow = rows.find((row) => row.style.display === 'none');
        addButton.disabled = !hiddenRow;
        if (!hiddenRow) {
            addButton.textContent = 'All floor descriptions added';
        }
    };

    addButton.addEventListener('click', function () {
        const hiddenRow = rows.find((row) => row.style.display === 'none');
        if (!hiddenRow) {
            return;
        }
        hiddenRow.style.display = '';
        updateButtonState();
    });

    updateButtonState();
}

function initUploadProgress() {
    const form = document.querySelector('#houseplan_form') || document.querySelector('#content-main form');
    if (!form) {
        return;
    }

    const progressContainer = document.createElement('div');
    progressContainer.className = 'upload-progress-container';
    progressContainer.style.display = 'none';
    progressContainer.innerHTML =
        '<div class="upload-progress-label">Uploading images: <strong class="upload-progress-percent">0%</strong></div>' +
        '<div class="upload-progress-track"><div class="upload-progress-fill"></div></div>' +
        '<div class="upload-progress-meta">0 MB / 0 MB</div>';

    const bulkRow = document.querySelector('.form-row.field-bulk_images');
    if (bulkRow && bulkRow.parentNode) {
        bulkRow.parentNode.insertBefore(progressContainer, bulkRow.nextSibling);
    } else {
        const submitRow = form.querySelector('.submit-row');
        if (submitRow && submitRow.parentNode) {
            submitRow.parentNode.insertBefore(progressContainer, submitRow);
        } else {
            form.appendChild(progressContainer);
        }
    }

    const percentNode = progressContainer.querySelector('.upload-progress-percent');
    const fillNode = progressContainer.querySelector('.upload-progress-fill');
    const metaNode = progressContainer.querySelector('.upload-progress-meta');
    const fileInputs = Array.from(form.querySelectorAll('input[type="file"]'));
    const submitButtons = Array.from(form.querySelectorAll('input[type="submit"], button[type="submit"]'));
    let activeSubmitter = null;

    submitButtons.forEach((button) => {
        button.addEventListener('click', function () {
            activeSubmitter = button;
        });
    });

    const formatMB = (bytes) => (bytes / (1024 * 1024)).toFixed(1);

    const updateProgress = (loaded, total) => {
        const safeTotal = total > 0 ? total : 1;
        const percent = Math.min(100, Math.round((loaded / safeTotal) * 100));
        percentNode.textContent = percent + '%';
        fillNode.style.width = percent + '%';
        metaNode.textContent = formatMB(loaded) + ' MB / ' + formatMB(total || 0) + ' MB';
    };

    const getSelectedFileTotals = () => {
        return fileInputs.reduce(
            (acc, input) => {
                if (!input.files || input.files.length === 0) {
                    return acc;
                }
                for (const file of input.files) {
                    acc.count += 1;
                    acc.total += file.size || 0;
                }
                return acc;
            },
            { count: 0, total: 0 }
        );
    };

    fileInputs.forEach((input) => {
        input.addEventListener('change', function () {
            const totals = getSelectedFileTotals();
            if (totals.count > 0) {
                progressContainer.style.display = '';
                percentNode.textContent = '0%';
                fillNode.style.width = '0%';
                metaNode.textContent = totals.count + ' file(s) selected, total ' + formatMB(totals.total) + ' MB';
            } else {
                progressContainer.style.display = 'none';
            }
        });
    });

    form.addEventListener('submit', function (event) {
        const hasFiles = fileInputs.some((input) => input.files && input.files.length > 0);

        if (!hasFiles) {
            return;
        }

        event.preventDefault();

        const formData = new FormData(form);
        const submitter = event.submitter || activeSubmitter;
        if (submitter && submitter.name) {
            formData.append(submitter.name, submitter.value || '1');
        }

        progressContainer.style.display = '';
        updateProgress(0, 0);
        submitButtons.forEach((btn) => {
            btn.disabled = true;
        });

        const request = new XMLHttpRequest();
        request.open('POST', form.action || window.location.href, true);
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        request.upload.addEventListener('progress', function (progressEvent) {
            if (progressEvent.lengthComputable) {
                updateProgress(progressEvent.loaded, progressEvent.total);
            }
        });

        request.addEventListener('error', function () {
            alert('Upload failed due to a network issue. Please try again.');
            submitButtons.forEach((btn) => {
                btn.disabled = false;
            });
        });

        request.addEventListener('load', function () {
            if (request.status >= 200 && request.status < 400) {
                updateProgress(1, 1);
                if (request.responseURL) {
                    window.location.href = request.responseURL;
                    return;
                }

                // Fallback for older browsers: render server response.
                document.open();
                document.write(request.responseText);
                document.close();
                return;
            }

            alert('Upload failed on the server. Please retry with a smaller batch.');
            submitButtons.forEach((btn) => {
                btn.disabled = false;
            });
        });

        request.send(formData);
    });
}
