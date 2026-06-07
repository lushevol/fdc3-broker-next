// Dark mode background color variable
const darkBackground = "#121E25";
const darkTextColor = "#CCCCCC";

const sidebarStyles = `
      .workflow-siderbar {
        background: ${darkBackground} !important;
      }
      .workflow-siderbar .ant-menu{
         background: ${darkBackground} !important;
        
      }
      .workflow-siderbar .ant-menu-item-group-list {
        background: ${darkBackground} !important;
      }
      .workflow-siderbar .ant-menu-item-group-list .ant-menu-item {
        background: ${darkBackground} !important;
      }
     .workflow-siderbar .ant-menu-item-group-title {
       background: ${darkBackground} !important;
     }
     .workflow-siderbar .ant-menu-title-content{
      color: ${darkTextColor} !important;
     }

     .workflow-siderbar__collapsed{
     background: ${darkBackground} !important;
     }
     .workflow-siderbar__collapsed .ant-menu-item-group{
     background: ${darkBackground} !important;
     }

     .workflow-siderbar__collapsed  .ant-menu-title-content{
      color: ${darkTextColor} !important;
     }
      .workflow-siderbar__collapsed  .ant-menu-title-content .ant-menu-item{
      color: ${darkTextColor} !important;
      }
     .workflow-siderbar__collapsed   .ant-menu-item  .flowzero-iconfont {
      color: ${darkTextColor} !important;
      }
    `;
export const getCustomThemeStyle = (theme: string): string => {
  if (theme === "dark") {
    return `
      .ant-table-cell {
       background: ${darkBackground} !important;
       color:white !important;
       }
      ${sidebarStyles}
    `;
  }
  return "";
};
