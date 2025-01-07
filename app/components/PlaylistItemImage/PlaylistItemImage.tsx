"use client";
import styles from "./PlaylistItemImage.module.scss"

export default function PlaylistItemImage(items: any) {
    const divClass = items.className
    const img = items['image'] !== undefined
            ? items.image
            : "https://images.unsplash.com/photo-1698444214003-dfdea976064a?auto=format&fit=crop&q=80&w=1931&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    return (
        <div className={ divClass + " " + styles.plate }>
            <div className={img === null ? styles.no_image : ""} style={{ backgroundImage: 'url(' + img + ')'}} />
        </div>
    )
}