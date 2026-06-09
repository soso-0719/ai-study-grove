//idに対して一つのURL
type PageProps = {
    params: {
        id: string;
    };
};

export default function LogDetailPage({ params }: PageProps) {
    return (
        <main>
            <h1>Study Log Detail</h1>
            <p>Log ID: {params.id}</p>
        </main>
    );
}