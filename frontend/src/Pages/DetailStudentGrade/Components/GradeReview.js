import React from "react";
import { Form, Input, InputNumber } from "antd";

const GradeReview = ({ form, maxPoint }) => {
  return (
    <Form form={form}>
      <Form.Item name="grade" label="Expected Grade">
        <InputNumber min={0} max={maxPoint} placeholder="Expected grade" />
      </Form.Item>
      <Form.Item name="comment" label="Explanation">
        <Input.TextArea placeholder="Explanation" />
      </Form.Item>
    </Form>
  );
};

export default GradeReview;
