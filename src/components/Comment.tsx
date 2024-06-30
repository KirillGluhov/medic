import { Button, Col, Divider, Flex, Row, Tooltip, Typography } from "antd";
import { 
    columnStyle,
    biggerRight,
    smallRight,
    boldText,
    grayText,
    justGray,
    centeredStyle,
    alignCenter,
    blueColorStyle,
    marginBottom1,
    mainCommentStyle,
    commentStyleWithMargin,
    displayFlex,
    displayNone
} from "../styles/additionalStyles";
import React, { useState } from "react";
import { CommentModel, ConsultationModel } from "./CommentsWrapper";
import { changeFormatToDateAndTime } from "../functions/smallFunctions";
import FormForCommentCreate from "./FormForCommentCreate";
import FormForRedactComment from "./FormForRedactComment";

interface CommentProps
{
    index: number,
    comment: CommentModel,
    specialityName?: string,
    numberComments?: number,
    changeOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isOpen: boolean,
    consultationId: string,
    repeatConsultation: () => void,
    messageSuccess: (value: string) => void,
    messageError: (value: string) => void
}

const Comment: React.FC<CommentProps> = ({
    index, 
    comment, 
    specialityName, 
    numberComments, 
    changeOpen, 
    isOpen, 
    consultationId, 
    repeatConsultation,
    messageSuccess,
    messageError
}) =>
{
    const [answer, setAnswer] = useState(false);
    const [redactNow, setRedactNow] = useState(false)
    
    return (
    <Flex 
        style={{...columnStyle, ...(index == 0 ? mainCommentStyle : commentStyleWithMargin), ...((isOpen || index == 0) ? displayFlex : displayNone)}} 
        className={index == 1 ? "LElement downLineSmaller" : index == 0 ? "downLine" : "downLineSmaller"}
    >
        <Row style={smallRight} gutter={[5,5]}>
            <Col>
                <Typography style={boldText}>{comment.author}</Typography>
            </Col>
            <Col>
                <Typography style={grayText}>{`(${specialityName ? specialityName.toLowerCase() : null})`}</Typography>
            </Col>
        </Row>
        {
            redactNow ? 
            <Row style={biggerRight} gutter={[5,5]}>
                <Col span={24}>
                    <FormForRedactComment 
                        textContent={comment.content} 
                        commentId={comment.id} 
                        messageSuccess={messageSuccess}
                        messageError={messageError}
                        repeatConsultation={repeatConsultation}
                        setRedactNow={setRedactNow}
                    />
                </Col>
            </Row> : 
            <Row style={biggerRight} gutter={[5,5]}>
                <Col>
                    <Typography>{comment.content}</Typography>
                </Col>
                <Col>
                {(comment.modifiedDate !== comment.createTime) ? <Tooltip placement="topRight" title={comment.modifiedDate ? changeFormatToDateAndTime(comment.modifiedDate) : null}>
                    <Typography style={justGray} className="onHover">(изменено)</Typography>
                </Tooltip> : null}
                </Col>
            </Row>
        }
        <Row style={{...smallRight, ...alignCenter}} className="downSmallLine">
            <Col>
                <Typography style={{...justGray, ...marginBottom1}}>{comment.createTime ? changeFormatToDateAndTime(comment.createTime) : null}</Typography>
            </Col>
            {(index == 0 && numberComments && numberComments > 1) ? <Col>
                <Button 
                    type="link" 
                    style={blueColorStyle} 
                    onClick={() => changeOpen(!isOpen)} 
                    size="small"
                >{isOpen ? `Скрыть ответы` : `Показать все (${numberComments-1})`}</Button>
            </Col> : null}
            <Col>
                <Button 
                    type="link" 
                    style={blueColorStyle} 
                    size="small" 
                    onClick={() => {setAnswer(!answer)}}
                >Ответить</Button>
            </Col>
            {(localStorage.getItem("me") === comment.authorId) ? <Col>
                <Button 
                    type="link" 
                    style={blueColorStyle} 
                    size="small" 
                    onClick={() => {setRedactNow(!redactNow)}}
                >Редактировать</Button>
            </Col> : null}
        </Row>
        {answer ? <Row>
            <Col span={24}>
                <FormForCommentCreate 
                    parentId={comment.id} 
                    consultationId={consultationId}
                    setAnswer={setAnswer}
                    repeatConsultation={repeatConsultation}
                    messageSuccess={messageSuccess}
                    messageError={messageError}
                />
            </Col>
        </Row> : null}
    </Flex>);
}

export default Comment;