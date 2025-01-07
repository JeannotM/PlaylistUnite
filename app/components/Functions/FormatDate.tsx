export default function FormatDate(value: number): string {
    const minutes = Math.floor(value / 60);
    const hours = Math.floor(minutes / 60);
    const seconds = Math.floor(value % 60);
    return (hours === 0 ? "" : hours + ":") + (hours >= 1 ? "0" : "") + minutes % 60 + ":" + (seconds < 10 ? "0" : "") + seconds % 60;
}