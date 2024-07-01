import { Typography, message } from "antd";
import { styleForCommentary } from "../../styles/additionalStyles";
import { InspectionConsultationModel } from "./DetailsInspection";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../const/constValues";
import ComentsWrapperInner from "./CommentsWrapperInner";

type SpecialityModel = {
    id: string,
    createTime: string,
    name: string
}

export type CommentModel = {
    id: string,
    createTime: string,
    modifiedDate?: string,
    content: string,
    authorId: string,
    author: string,
    parentId?: string
}

export type ConsultationModel = {
    id: string,
    createTime: string,
    inspectionId?: string,
    speciality?: SpecialityModel,
    comments?: CommentModel[]
}

interface CommentsWrapperProps
{
    consultation: InspectionConsultationModel
}

const CommentsWrapper: React.FC<CommentsWrapperProps> = ({consultation}) =>
{
    const [commentsInfo, setCommentsInfo] = useState<ConsultationModel | null>(null);
    

    const messageSuccess = (value: string) => {
        message.success(value);
    }

    const messageError = (value: string) => {
        message.error(value);
    }

    const repeatConsultation = () => {
        axios.get(baseUrl + `consultation/${consultation.id}`, 
            { 
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem("token")}` 
                } 
            }
        )
        .then(response => {
            console.log(response);
            setCommentsInfo(response.data);
        })
        .catch(error => {
            console.log(error);
        })
    }

    useEffect(() => {
        axios.get(baseUrl + `consultation/${consultation.id}`, 
            { 
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem("token")}` 
                } 
            }
        )
        .then(response => {
            console.log(response);
            setCommentsInfo(response.data);
        })
        .catch(error => {
            console.log(error);
        })
    },[consultation])


    return (<>
    <Typography style={styleForCommentary}>Комментарии</Typography>
    {
        commentsInfo && 
        commentsInfo.comments
        &&
        <ComentsWrapperInner 
            comm={commentsInfo.comments[0]} 
            index={0}
            comments={commentsInfo.comments} 
            messageSuccess={messageSuccess}
            messageError={messageError}
            repeatConsultation={repeatConsultation}
            consultationId={commentsInfo.id}
            specialityName={commentsInfo?.speciality?.name} 
        />
    }
    </>)
}

export default CommentsWrapper;