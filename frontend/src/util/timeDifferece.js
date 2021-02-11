export default function(endTime) {
    const now = new Date();
    const end = new Date(endTime);
    const daysLeft =  Math.floor((Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) - Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) ) /(1000 * 60 * 60 * 24));
    if(daysLeft < 0){
        return "Funding period ended";
    }
    if(daysLeft <= 1){
        return `${daysLeft} day remaining`;
    } else {
        return `${daysLeft} days remaining`;
    }
}