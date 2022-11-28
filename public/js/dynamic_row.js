function addRow(element) {

    let parent = element.parentNode;
    let grandParent = parent.parentNode;
    let greatGrandParent = grandParent.parentNode;
    let greatGreatGrandParent = greatGrandParent.parentNode;
    clone(greatGrandParent, greatGreatGrandParent);


    function clone(rowToCopy, target) {
        let newRow = rowToCopy.cloneNode(true);
        for (let i = 0; i < newRow.childNodes.length; i++) {
            let child = newRow.childNodes[i];
            for (let k = 0; k < child.childNodes.length; k++) {
                let grandChild = child.childNodes[k];
                if (grandChild.value !== undefined) {
                    grandChild.value = "";
                }
                if (grandChild.checked) {
                    grandChild.checked = false;
                }

            }
        }
        target.appendChild(newRow);
    }
}

function deleteRow(element) {
    let parent = element.parentNode;
    let grandParent = parent.parentNode;
    let greatGrandParent = grandParent.parentNode;
    let greatGreatGrandParent = greatGrandParent.parentNode;
    let rows = greatGreatGrandParent.getElementsByClassName("fitment_row");
    if (rows.length <= 1) {
        return;
    } else {
        greatGrandParent.remove();
    }
}

