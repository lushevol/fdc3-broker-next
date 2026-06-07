import styled from "@emotion/styled";

export const NodeContainer = styled("div")<{
  isHovered?: boolean;
  icon?: string;
}>`
  position: relative;
  width: 130px;
  height: 111px;
  background: #fff;
  border: 1px solid #808080;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${(props) =>
    props.icon
      ? `background-image: url(${props.icon});
         background-repeat: no-repeat;
         background-position: center;
         background-size: 75px 75px;`
      : ""}
  ${(props) =>
    props.isHovered ? `box-shadow: 0 0 0 6px rgba(151, 152, 154, 0.2);` : ""}
`;

export const DeleteBtn = styled("button")`
  position: absolute;
  top: -30px;
  right: -2px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  padding: 0;
`;

export const LabelWrap = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: -60px;
  width: 100%;
  z-index: 2;
`;

export const Label = styled("div")`
  padding: 4px 16px;
  background: transparent;
  color: #757678;
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 2px;
  height: 24px;
  line-height: 24px;
  display: block;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  white-space: nowrap;
  text-align: center;
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SubLabel = styled("div")`
  display: inline-block;
  color: #a9a9ab;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  margin-top: 2px;
  white-space: nowrap;
`;
