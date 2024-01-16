import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import { Button, List, Popconfirm } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const DragHandle = SortableHandle(() => <span>::</span>);

const GradeCompositionItem = SortableElement(
  ({ item, index, editingId, handleFinalized, handleDelete, handleEdit }) => (
    <List.Item
      className="w-full bg-white/10 flex items-center gap-2"
      key={`item-${index}`}
      actions={[
        <Popconfirm
          title="Are you sure to finalize this grade structure?"
          onConfirm={() => handleFinalized(item)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary">Finalize</Button>
        </Popconfirm>,
        <a onClick={() => handleEdit(item)}>
          {editingId == item._id ? (
            <Button type="dashed">Editing..</Button>
          ) : (
            <Button type="default">Edit</Button>
          )}
        </a>,
        <Popconfirm
          title="Are you sure to delete this grade structure?"
          onConfirm={() => handleDelete(item._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>
            <CloseOutlined />
          </Button>
        </Popconfirm>,
      ]}
    >
      <DragHandle />
      <List.Item.Meta
        className="flex-1"
        title={item.name}
        description={`Grade Weight: ${item.weight}%`}
      />
    </List.Item>
  )
);

const GradeCompositionList = SortableContainer(
  ({ items, editingId, handleFinalized, handleEdit, handleDelete }) => {
    return (
      <List
        dataSource={items}
        renderItem={(item, index) => (
          <GradeCompositionItem
            key={`item-${index}`}
            index={index}
            editingId={editingId}
            handleFinalized={handleFinalized}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            item={item}
          />
        )}
      />
    );
  }
);

export default GradeCompositionList;
