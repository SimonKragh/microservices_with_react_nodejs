//Insturction to other classes on how they can be an argument to the addMarker method 
export interface Mappable {
    location: {
        lat: number;
        lng: number;
    };
    markerContent(): string
    color: string;
}


export class CustomMap {
    private googleMap: google.maps.Map;

    constructor(divId: string) {
        const htmlMapDiv = document.getElementById(divId);
        const htmlDiv: HTMLElement = htmlMapDiv as HTMLElement;
        this.googleMap = new google.maps.Map(htmlDiv, {
            zoom: 1,
            center: {
            lat: 0,
            lng: 0,
            },
        });
    }

    addMarker(mappable: Mappable) : void {
        const marker = new google.maps.Marker({
            map: this.googleMap,
            position: {
                lat: mappable.location.lat,
                lng: mappable.location.lng
            }
        });

        marker.addListener('click', () => {
            const infoWindow = new google.maps.InfoWindow({
                content: mappable.markerContent()
            });

            infoWindow.open(this.googleMap, marker)
        });
    }
}