import React, { useState, useEffect } from "react";
import { List, Input, Button, message } from "antd";
import { Comment } from "@ant-design/compatible";
import gradeReviewApi from "../../../Services/gradeReviewApi";

const CommentSection = ({ review, setReview }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    setComments(review?.feedback || []);
  }, [review]);

  const handleCommentSubmit = async () => {
    console.log(review);
    if (!newComment) return;

    // Create a new comment object
    const comment = {
      userId: user._id,
      content: newComment,
    };

    try {
      // Send the new comment to the backend
      await gradeReviewApi.createComment(review._id, comment);

      // Add the new comment to the list and reset the new comment
      setComments([
        ...comments,
        {
          content: newComment,
          userId: user,
          date: new Date(),
        },
      ]);
      setNewComment("");
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div className="my-3 mx-auto">
      <List
        header={<div>Comments</div>}
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={(item) => (
          <li>
            <Comment
              author={
                item.userId._id == user._id ? "You" : item.userId?.fullname
              }
              avatar={item.userId.profilePic}
              content={item.content}
              datetime={Date(item.date).toString().slice(0, 21)}
            />
          </li>
        )}
      />

      <div>
        <Input.TextArea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <Button className="mt-3" type="primary" onClick={handleCommentSubmit}>
          Submit Comment
        </Button>
      </div>
    </div>
  );
};

export default CommentSection;
