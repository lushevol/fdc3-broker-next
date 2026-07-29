import { css } from 'lit';

export default css`

sc-link {
  /*margin-bottom: 5px;
   margin-top: 5px;*/
  display:inline-flex;
}

.sc-button-bottom{
  margin-bottom:1.25rem
}
.sc-button-top{
  margin-top:1.25rem
}

.sc-icon{
  color: var(--sc-color-red-500);
  margin-right:10px;
  display: inline-flex;
}

.icon-container{
  display: flex;
  flex-direction: row;
  column-gap: 10px;
  margin-bottom: 0.5rem; 
}
.icon-container:last-of-type{
  margin-bottom: 0; 
}

.slot-group{
  display: flex
  flex-direction: column;
  width: 100%;
}

.icon-container *{
  flex-basis: 1;
  color: var(--sc-color-red-500);
}

.icon-container sc-text-input{
  flex: 1;
}

.icon-container .icon-container {
  flex-direction: column;
}
.icon-container .slot-group{
  flex: 1;
}


.icon-container sc-icon:hover{
  cursor: pointer;
}

::slotted(*){ 
  flex:1;
}

 `;