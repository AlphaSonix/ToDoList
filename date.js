//jshint esversion:6

export function getDate() {

   const today = new Date();

    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }
    return today.toLocaleString('en-gb', options); 
}
