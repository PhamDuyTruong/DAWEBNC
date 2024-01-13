import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Input, Form, message, InputNumber, List } from "antd";
import gradeApi from "../../Services/gradeApi";
import { arrayMoveImmutable } from "array-move";
import GradeCompositionList from "./Components/GradeCompositionList";

const GradeStructure = ({ isTeacher, classId }) => {
  const [form] = Form.useForm();
  const [gradeStructures, setGradeStructures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalWeight, setTotalWeight] = useState(0);
  const editingId = useRef(null);

  useEffect(() => {
    fetchGradeStructures();
  }, []);

  const getOriginWeight = (data) => {
    const weight = data.reduce((acc, cur) => {
      if (cur._id == editingId.current) return acc;
      return acc + cur.weight;
    }, 0);

    return weight;
  };

  const fetchGradeStructures = async () => {
    setLoading(true);
    try {
      const res = await gradeApi.getGradeStructures(classId);
      const data = res.data;
      setGradeStructures(data);
      setTotalWeight(getOriginWeight(data));
    } catch (error) {
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values) => {
    setLoading(true);
    try {
      if (editingId.current) {
        await gradeApi.updateGradeStructureById(classId,  editingId.current, values);
        editingId.current = null;
        fetchGradeStructures();
      } else {
        await gradeApi.createGradeStructure(classId, values);
        fetchGradeStructures();
      }

      message.success("Successfully saved the grade structure");
    } catch (error) {
      message.error(error.response.data.message);
    } finally {
      form.resetFields();
      setLoading(false);
    }
  };

  const handleEdit = (gradeComposition) => {
    setTotalWeight(getOriginWeight(gradeStructures));
    editingId.current = gradeComposition._id;
    form.setFieldsValue(gradeComposition);
  };

  const handleDelete = (id) => {
    setLoading(true);
    gradeApi
      .deleteGradeStructure(classId, id)
      .then((res) => {
        message.success("Successfully deleted the grade structure");
        fetchGradeStructures();
      })
      .catch((err) => {
        message.error(err.response.data.message);
        setLoading(false);
      });
  };

  const onWeightChanged = (value) => {
    const originWeight = getOriginWeight(gradeStructures);
    setTotalWeight(originWeight + value);
  };

  const onSortEnd = async ({ oldIndex, newIndex }) => {
    const newGradeStructures = arrayMoveImmutable(
      gradeStructures,
      oldIndex,
      newIndex
    );
    setGradeStructures(newGradeStructures);
    await gradeApi.updateGradeStructures(classId, newGradeStructures);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2 className="text-center">Grade Structure</h2>
      <p className="text-center text-zinc-400">
        Grade structure is used to calculate the final grade of the student. The
        total sum must be exactly 100%
      </p>

      {isTeacher() ? (
        <>
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <Form.Item label="Grade Name" name="name">
              <Input placeholder="Enter grade name" />
            </Form.Item>
            <Form.Item label="Grade Weight (%)" name="weight">
              <InputNumber
                min={0}
                placeholder="Enter grade weight"
                onChange={onWeightChanged}
              />
            </Form.Item>
            <div>
              <Button
                type="default"
                className="mr-2"
                onClick={() => {
                  editingId.current = null;
                  form.resetFields();
                }}
              >
                Reset
              </Button>
              <Button
                type="primary"
                disabled={!editingId && totalWeight > 100}
                loading={loading}
                htmlType="submit"
              >
                Save
              </Button>
            </div>
          </Form>
          <div className="mt-4 text-sm text-black/40">
            The remaining percent: {100 - totalWeight}%
          </div>
          <hr />

          <GradeCompositionList
            items={gradeStructures}
            editingId={editingId}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            onSortEnd={onSortEnd}
          />
        </>
      ) : (
        <List
          dataSource={gradeStructures}
          renderItem={(item) => (
            <List.Item className="w-full bg-white/10 flex items-center gap-2">
              <List.Item.Meta
                className="flex-1"
                title={item.name}
                description={`Grade Weight: ${item.weight}%`}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default GradeStructure;
