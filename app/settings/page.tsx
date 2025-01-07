import KeyFields from "../components/SettingButtons/KeyFields";
import styles from "./page.module.scss";

export default function Settings() {
    return (
        <div className={styles.settings}>
            <h1>Settings</h1>
            <KeyFields />
        </div>
    )
}