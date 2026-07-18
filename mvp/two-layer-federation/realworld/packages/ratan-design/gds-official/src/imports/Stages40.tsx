import svgPaths from './svg-bk2wl65qth';

function ContentContainer() {
  return (
    <div
      className="bg-white flex-[1_0_0] h-full min-h-px min-w-px mr-[-2px] relative z-[2]"
      data-name="contentContainer"
    >
      <div
        aria-hidden="true"
        className="absolute border-[rgba(255,255,255,0)] border-b-2 border-solid border-t-2 inset-[-2px_0] pointer-events-none"
      />
    </div>
  );
}

function Container() {
  return (
    <div
      className="content-stretch flex flex-[1_0_0] h-full isolate items-center min-h-px min-w-px mr-[-2px] pr-[2px] relative"
      data-name="container"
    >
      <ContentContainer />
      <div
        className="h-full mr-[-2px] relative shrink-0 w-[20.506px] z-[1]"
        data-name="endJoint"
      >
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 20.5064 56"
        >
          <path
            d={svgPaths.p1a3fec00}
            fill="var(--fill-0, white)"
            id="endJoint"
          />
        </svg>
      </div>
    </div>
  );
}

function StageContainer() {
  return (
    <div
      className="absolute content-stretch flex inset-0 items-center pr-[2px] rounded-[6px]"
      data-name="stageContainer"
    >
      <div
        className="h-full mr-[-2px] relative shrink-0 w-[18px]"
        data-name="frontJoint"
      >
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 17.9998 56"
        >
          <path
            d={svgPaths.pe5fbc80}
            fill="var(--fill-0, white)"
            id="frontJoint"
          />
        </svg>
      </div>
      <Container />
    </div>
  );
}

function Icon() {
  return (
    <div
      className="relative rounded-[32px] shrink-0 size-[28px]"
      data-name="Icon"
    >
      <div className="content-stretch flex items-center justify-center overflow-clip relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['SC_Prosper_Sans:Medium',sans-serif] justify-center leading-[0] max-h-[10px] min-w-[10px] not-italic relative shrink-0 text-[18px] text-center text-white whitespace-nowrap">
          <p className="leading-[26px]">1</p>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute border-[1.8px] border-solid border-white inset-0 pointer-events-none rounded-[32px]"
      />
    </div>
  );
}

function NumberContainer() {
  return (
    <div
      className="content-stretch flex items-center justify-center min-h-[40px] pl-[8px] relative rounded-[32px] shrink-0"
      data-name="numberContainer"
    >
      <Icon />
    </div>
  );
}

function ItemLabel() {
  return (
    <div
      className="content-stretch flex items-center min-h-[24px] relative shrink-0 w-full"
      data-name="<Item label>"
    >
      <p className="flex-[1_0_0] font-['SC_Prosper_Sans:Medium',sans-serif] leading-[22px] min-h-px min-w-px not-italic relative text-[14px] text-white whitespace-pre-wrap">
        Stage 1
      </p>
    </div>
  );
}

function TextContainer() {
  return (
    <div
      className="flex-[1_0_0] min-h-[40px] min-w-px relative"
      data-name="textContainer"
    >
      <div className="flex flex-col justify-center min-h-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start justify-center min-h-[inherit] pl-[8px] relative w-full">
          <ItemLabel />
          <p className="font-['SC_Prosper_Sans:Regular',sans-serif] leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#d9d9d9] text-[12px] text-ellipsis w-full whitespace-nowrap">
            Provides contextual information that explains the purpose or meaning
            to the title
          </p>
        </div>
      </div>
    </div>
  );
}

function ContentContainer1() {
  return (
    <div
      className="bg-[#0473ea] content-stretch flex flex-[1_0_0] gap-[4px] items-center min-h-px min-w-px mr-[-2px] py-[8px] relative z-[2]"
      data-name="contentContainer"
    >
      <NumberContainer />
      <TextContainer />
    </div>
  );
}

function Container1() {
  return (
    <div
      className="content-stretch flex flex-[1_0_0] isolate items-center min-h-px min-w-px mr-[-2px] pr-[2px] relative"
      data-name="container"
    >
      <ContentContainer1 />
      <div className="flex flex-row items-center self-stretch">
        <div
          className="h-full mr-[-2px] relative shrink-0 w-[20.506px] z-[1]"
          data-name="endJoint"
        >
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 20.5064 56"
          >
            <path
              d={svgPaths.p1a3fec00}
              fill="var(--fill-0, #0473EA)"
              id="endJoint"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Stage() {
  return (
    <div
      className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-[104px] mr-[-8px] pr-[2px] relative rounded-[6px]"
      data-name="Stage 1"
    >
      <StageContainer />
      <div className="flex flex-row items-center self-stretch">
        <div
          className="h-full mr-[-2px] relative shrink-0 w-[18px]"
          data-name="frontJoint"
        >
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 17.9998 56"
          >
            <path
              d={svgPaths.pe5fbc80}
              fill="var(--fill-0, #0473EA)"
              id="frontJoint"
            />
          </svg>
        </div>
      </div>
      <Container1 />
    </div>
  );
}

function ContentContainer2() {
  return (
    <div
      className="bg-white flex-[1_0_0] h-full min-h-px min-w-px mr-[-2px] relative z-[2]"
      data-name="contentContainer"
    >
      <div
        aria-hidden="true"
        className="absolute border-[rgba(255,255,255,0)] border-b-2 border-solid border-t-2 inset-[-2px_0] pointer-events-none"
      />
    </div>
  );
}

function Container2() {
  return (
    <div
      className="content-stretch flex flex-[1_0_0] h-full isolate items-center min-h-px min-w-px mr-[-2px] pr-[2px] relative"
      data-name="container"
    >
      <ContentContainer2 />
      <div
        className="h-full mr-[-2px] relative shrink-0 w-[20.506px] z-[1]"
        data-name="endJoint"
      >
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 20.5064 56"
        >
          <path
            d={svgPaths.p1a3fec00}
            fill="var(--fill-0, white)"
            id="endJoint"
          />
        </svg>
      </div>
    </div>
  );
}

function StageContainer1() {
  return (
    <div
      className="absolute content-stretch flex inset-0 items-center pr-[2px] rounded-[6px]"
      data-name="stageContainer"
    >
      <div
        className="h-full mr-[-2px] relative shrink-0 w-[18px]"
        data-name="frontJoint"
      >
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 17.9998 56"
        >
          <path
            d={svgPaths.pe5fbc80}
            fill="var(--fill-0, white)"
            id="frontJoint"
          />
        </svg>
      </div>
      <Container2 />
    </div>
  );
}

function Icon1() {
  return (
    <div
      className="relative rounded-[32px] shrink-0 size-[28px]"
      data-name="Icon"
    >
      <div className="content-stretch flex items-center justify-center overflow-clip relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['SC_Prosper_Sans:Medium',sans-serif] justify-center leading-[0] max-h-[10px] min-w-[10px] not-italic relative shrink-0 text-[#035cbb] text-[18px] text-center whitespace-nowrap">
          <p className="leading-[26px]">2</p>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute border-[#035cbb] border-[1.8px] border-solid inset-0 pointer-events-none rounded-[32px]"
      />
    </div>
  );
}

function NumberContainer1() {
  return (
    <div
      className="content-stretch flex items-center justify-center min-h-[40px] pl-[8px] relative rounded-[32px] shrink-0"
      data-name="numberContainer"
    >
      <Icon1 />
    </div>
  );
}

function Label() {
  return (
    <div
      className="content-stretch flex items-center min-h-[24px] relative shrink-0 w-full"
      data-name="label"
    >
      <p className="flex-[1_0_0] font-['SC_Prosper_Sans:Medium',sans-serif] leading-[22px] min-h-px min-w-px not-italic relative text-[#333] text-[14px] whitespace-pre-wrap">
        Stage 2
      </p>
    </div>
  );
}

function TextContainer1() {
  return (
    <div
      className="flex-[1_0_0] min-h-[40px] min-w-px relative"
      data-name="textContainer"
    >
      <div className="flex flex-col justify-center min-h-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start justify-center min-h-[inherit] pl-[8px] relative w-full">
          <Label />
          <p className="font-['SC_Prosper_Sans:Regular',sans-serif] leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#595959] text-[12px] text-ellipsis w-full whitespace-nowrap">
            Provides contextual information that explains the purpose or meaning
            to the title
          </p>
        </div>
      </div>
    </div>
  );
}

function ContentContainer3() {
  return (
    <div
      className="bg-white content-stretch flex flex-[1_0_0] gap-[4px] items-center min-h-px min-w-px mr-[-2px] py-[8px] relative z-[2]"
      data-name="contentContainer"
    >
      <div
        aria-hidden="true"
        className="absolute border-[#ccc] border-b border-solid border-t inset-0 pointer-events-none"
      />
      <NumberContainer1 />
      <TextContainer1 />
    </div>
  );
}

function Container3() {
  return (
    <div
      className="content-stretch flex flex-[1_0_0] isolate items-center min-h-px min-w-px mr-[-2px] pr-[2px] relative"
      data-name="container"
    >
      <ContentContainer3 />
      <div className="flex flex-row items-center self-stretch">
        <div
          className="h-full mr-[-2px] relative shrink-0 w-[20.506px] z-[1]"
          data-name="endJoint"
        >
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 20.5064 56"
          >
            <path
              d={svgPaths.pc1ae680}
              fill="var(--fill-0, white)"
              id="endJoint"
              stroke="var(--stroke-0, #CCCCCC)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Stage1() {
  return (
    <div
      className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-[104px] mr-[-8px] pr-[2px] relative rounded-[6px]"
      data-name="Stage 2"
    >
      <StageContainer1 />
      <div className="flex flex-row items-center self-stretch">
        <div
          className="h-full mr-[-2px] relative shrink-0 w-[18px]"
          data-name="frontJoint"
        >
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 17.9998 56"
          >
            <path
              d={svgPaths.p2d093cf0}
              fill="var(--fill-0, white)"
              id="frontJoint"
              stroke="var(--stroke-0, #CCCCCC)"
            />
          </svg>
        </div>
      </div>
      <Container3 />
    </div>
  );
}

export default function Stages() {
  return (
    <div
      className="content-stretch flex items-center justify-center pr-[8px] relative size-full"
      data-name="Stages 4.0"
    >
      <Stage />
      <Stage1 />
    </div>
  );
}
