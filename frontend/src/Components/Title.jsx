import {Helmet} from "react-helmet-async"

export const Title = () => {

    const title = "Chat App";
    const discription = " This a Simple Chat App ";

    return (
        <Helmet>
            <title>
                {title}
            </title>
            <meta name="description" content={discription} />
        </Helmet>

    )
}