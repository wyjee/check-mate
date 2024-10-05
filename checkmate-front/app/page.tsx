import Translation from "@/app/components/Main/Translation";
import History from "@/app/components/Main/History";

export default function Home () {
    return (
        <main className={'main flex_col'}>
            <Translation />
            <History />
        </main>
    )
}