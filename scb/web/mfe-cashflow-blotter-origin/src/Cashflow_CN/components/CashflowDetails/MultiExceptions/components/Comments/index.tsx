import { Form, Input } from "antd";
import { forwardRef, useImperativeHandle } from "react";

import {
  MultiExceptionsFormNames,
  MultiExceptionsNames,
} from "../../common/interface";
import { CommentsProps } from "./interface";
import StyledRoot, { classes } from "./style";

const formDefinition = {
  name: MultiExceptionsNames.Comment,
  rules: [{ required: true, message: "please input comment !" }],
};

const Comments = forwardRef(({ data }: CommentsProps, ref) => {
  const [form] = Form.useForm();
  useImperativeHandle(
    ref,
    () => {
      return {
        getForm() {
          return form;
        },
      };
    },
    [form]
  );
  return (
    <StyledRoot className={classes.root}>
      <Form
        name={MultiExceptionsFormNames.CommentsForm}
        form={form}
        initialValues={data}
        size="small"
        autoComplete="off"
      >
        <Form.Item {...formDefinition}>
          <Input.TextArea rows={4} placeholder="Comment" maxLength={200} />
        </Form.Item>
      </Form>
    </StyledRoot>
  );
});

export default Comments;
