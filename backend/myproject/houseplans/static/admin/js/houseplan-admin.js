document.addEventListener('DOMContentLoaded', function () {
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
});
