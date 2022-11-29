window.onload = function () {

    let makeOptions = document.getElementsByName('make_options');

    let newOptions = document.createElement('option');

    axios.get('https://partscentral.online/parts/bike_make').then((res) => {
        console.log('getting bike makes');
        //axios.get("http://localhost:3000/parts/bike_make").then((res) => {
        console.log(res.data);
        res.data.forEach((bikeProducer) => {
            newOptions = document.createElement('option');
            newOptions.value = bikeProducer.bikeProducer;
            newOptions.innerHTML = bikeProducer.bikeProducer;
            makeOptions.appendChild(newOptions);
        });
    });
}