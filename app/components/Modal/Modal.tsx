"use client"
import Image from "next/image";
import { ChangeEvent, FormEvent, MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import EventNames from "../EventNames/EventNames";

export default function Modal(props: { styles: any }) {
    const [imageSource, setImageSource] = useState({ });
    const [title, setTitle] = useState("");
    const imageFile = useRef("");
    let currentId = useRef(-1);

    const onImageChanged = (event: ChangeEvent) => {// @ts-ignore
        const file = event.target.files[0];

        if (!file.type.startsWith('image/')) { return; }

        const reader = new FileReader();
        reader.onload = (function () { return function (e) {// @ts-ignore
            setImageSource({ backgroundImage: "url(" + e.target.result + ")", backgroundSize: "cover", backgroundRepeat: "no-repeat" });

            // @ts-ignore
            imageFile.current = e.target.result;
        }; })();

        reader.readAsDataURL(file);
    };


    const onSubmit = (e: FormEvent) => {
        e.preventDefault();

        // @ts-ignore
        if(!e.nativeEvent.submitter.classList.contains(props.styles.modal_container) // @ts-ignore
                && !e.nativeEvent.submitter.classList.contains(props.styles.exit) && e.nativeEvent.submitter.tagName !== "IMG") {
            window.dispatchEvent(new CustomEvent(EventNames.modal.save, { detail: {
                "playlistId": currentId.current, // @ts-ignore
                "name": e.target[2].value,
                "cover": imageFile.current
            }}));

            closeModal(true);
        }
    }


    const closeModal = (event: any | boolean) => {
        if(event === true) { 
            document.getElementsByClassName(props.styles.modal_container)[0].setAttribute("data-show", "0");
            return;
        }


        const target = event.target;
        if(target.classList.contains(props.styles.modal_container) 
                || target.classList.contains(props.styles.exit) || target.tagName === "IMG") {
            document.getElementsByClassName(props.styles.modal_container)[0].setAttribute("data-show", "0");
        }
    };


    const data = useCallback((event: any) => {
        setImageSource({ backgroundImage: "url(" + event.detail.cover + ")", backgroundSize: "cover", backgroundRepeat: "no-repeat" });
        currentId.current = event.detail.playlistId;
        imageFile.current = event.detail.cover;
        setTitle(event.detail.name);
        
        document.getElementsByClassName(props.styles.modal_container)[0].setAttribute("data-show", "1"); // @ts-ignore
        document.getElementsByClassName(props.styles.input)[0].value = event.detail.name;
    }, [setImageSource, setTitle, props.styles.modal_container, props.styles.input]);


    useEffect(() => {
        window.addEventListener(EventNames.modal.edit, data);
        return () => window.removeEventListener(EventNames.modal.edit, data);
    }, [data]);
    return (
        <div className={props.styles.modal_container} data-show={0} onClick={closeModal}>
            <form autoFocus={true} onSubmit={onSubmit} className={props.styles.modal} >
                <div className={props.styles.title_card}>
                    <h4 className={props.styles.title}>Edit Details</h4>
                    <button className={props.styles.exit} onClick={closeModal}>
                        <Image src={"/close.svg"} width={20} height={20} alt="exit modal" />
                    </button>
                </div>
                <input type="file" onChange={onImageChanged} name="image" accept=".jpg,.png,.jpeg,.svg" className={props.styles.image} />
                <div style={imageSource} className={props.styles.image} />

                <input type="text" name="title" className={props.styles.input} defaultValue={title} />

                <label className={props.styles.label} htmlFor="submit">Name</label>
                <input id="submit" type="submit" className={props.styles.save} value={"Submit Changes"} />
            </form>
        </div>
    )
}