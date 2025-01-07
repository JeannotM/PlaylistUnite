"use client"
import { DelayedEffect } from "@/app/models/DelayedEffect";
import { FormEvent, KeyboardEvent, MouseEvent, useCallback, useRef, useState } from "react";
import EventNames from "@/app/components/EventNames/EventNames";

export default function KeyFields() {
    const [functionList, setFunctionList] = useState(<div></div>);
    const changeKeyFunction = useRef((key: string, data: any) => {});
    const removeKeyFunction = useRef((key: string) => {});
    const addKeyFunction = useRef(() => {});
    
    const [dataKeys, setDataKeys]: [dataKeys: {[key: string]: {id: string, type: string, func: number}}, setDataKeys: any] = useState({});
    const [dataFunctions, setDataFunctions] = useState({});
    const [keys, setKeys] = useState([]);


    const getCurrentData = (id: string) => {
        const el: any = document.getElementById("key-" + id);
        return {
            key: el.querySelector("[data-id='key']").value,
            type: el.querySelector("[data-id='extraKey']").value,
            func: el.querySelector("[data-id='function']").value,
            oldKey: el.querySelector("[data-oldkey]").getAttribute("data-oldkey")
        }
    }


    const hasDataFunction = (target: any): boolean => {
        const id = target.getAttribute("data-id");
        return id === "key" || id === "extraKey" || id === "function";
    }


    const changeExtraKey = useCallback((event: FormEvent, key: string) => {
        const target: any = event.target;
        if(!hasDataFunction(target)) { event.preventDefault(); }
        if(target.getAttribute("data-id") !== "extraKey") { return; }
        
        let data = getCurrentData(key);
        data.type = target.value;

        changeKeyFunction.current(data.oldKey && data.oldKey !== null ? data.oldKey : "", data);
    }, []);


    const changeFunction = useCallback((event: FormEvent, key: string) => {
        const target: any = event.target;
        if(!hasDataFunction(target)) { event.preventDefault(); }
        if(target.getAttribute("data-id") !== "function") { return; }

        let data = getCurrentData(key);
        data.func = target.value;

        changeKeyFunction.current(data.oldKey && data.oldKey !== null ? data.oldKey : "", data);
    }, []);


    const changeKey = useCallback((event: KeyboardEvent, key: string) => {
        const target: any = event.target;
        if(!hasDataFunction(target)) { event.preventDefault(); }
        if(target.getAttribute("data-id") !== "key") { return; }
        
        let data = getCurrentData(key);

        if(target && target !== null) {
            target.value = event.code;
        }

        data.key = event.code;

        changeKeyFunction.current(data.oldKey && data.oldKey !== null ? data.oldKey : "", data);
    }, []);


    const removeKey = useCallback((event: MouseEvent, key: string) => {
        const target: any = event.target;
        if(!hasDataFunction(target)) { event.preventDefault(); }
        if(target.getAttribute("data-id") !== "delete") { return; }
        removeKeyFunction.current(key);
    }, []);


    const data = useCallback((event: Event) => { // @ts-ignore
        let detailFunctions = event.detail.functions(); // @ts-ignore
        let detailKeys = event.detail.keys();

        if(detailKeys !== undefined) { // @ts-ignore
            setKeys(Object.keys(detailKeys));
            setDataKeys(detailKeys);
        }


        if(detailFunctions !== dataFunctions) { // @ts-ignore
            let functionKeys = Object.keys(detailFunctions); // @ts-ignore

            setDataFunctions(detailFunctions); // @ts-ignore
            setFunctionList(<>{functionKeys.map((key, index) => (
                <option key={key} value={index}>{detailFunctions[key]?.name}</option>
            ))}</>)
        }
        

        // @ts-ignore
        changeKeyFunction.current = (key: string, data: any) => event.detail.changeFunction(key, data); // @ts-ignore
        removeKeyFunction.current = (key: number) => event.detail.removeFunction(key); // @ts-ignore
        addKeyFunction.current = () => event.detail.addFunction();
    }, [dataFunctions]);

    DelayedEffect(EventNames.settings.keys, data);
    return (
        <div id="table">
            <div>
                <p>Extra</p>
                <p>Key</p>
                <p>Function</p>
                <p></p>
            </div>
            {keys.map((key, index) => (
                <div key={index} id={"key-" + key}>
                    <p><select onInput={(e) => changeExtraKey(e, key)} value={dataKeys[key].type} data-id="extraKey">
                        <option value="ctrl">Ctrl</option>
                        <option value="alt">Alt</option>
                        <option value="none">None</option>
                    </select></p>
                    <p><input onKeyUp={(e) => changeKey(e, key)} data-oldkey={key} data-id="key" value={key} placeholder="Press any key.."></input></p>
                    <p><select onInput={(e) => changeFunction(e, key)} value={dataKeys[key].func} data-id="function" aria-readonly>{functionList}</select></p>
                    <p><button data-id="delete" onClick={(e) => removeKey(e, key)}>-</button></p>
                </div>
            ))}
            <div>
                <p data-id="add"><button onClick={addKeyFunction.current}>+ Add</button></p>
            </div>
        </div>
    )
}