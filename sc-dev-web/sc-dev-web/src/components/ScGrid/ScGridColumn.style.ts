import { css } from 'lit';

export default css`
  .sc-grid-col,
  .col-1,
  .col-10,
  .col-11,
  .col-12,
  .col-2,
  .col-3,
  .col-4,
  .col-5,
  .col-6,
  .col-7,
  .col-8,
  .col-9,
  .col-auto,
  .col-lg,
  .col-lg-1,
  .col-lg-10,
  .col-lg-11,
  .col-lg-12,
  .col-lg-2,
  .col-lg-3,
  .col-lg-4,
  .col-lg-5,
  .col-lg-6,
  .col-lg-7,
  .col-lg-8,
  .col-lg-9,
  .col-lg-auto,
  .col-md,
  .col-md-1,
  .col-md-10,
  .col-md-11,
  .col-md-12,
  .col-md-2,
  .col-md-3,
  .col-md-4,
  .col-md-5,
  .col-md-6,
  .col-md-7,
  .col-md-8,
  .col-md-9,
  .col-md-auto,
  .col-sm,
  .col-sm-1,
  .col-sm-10,
  .col-sm-11,
  .col-sm-12,
  .col-sm-2,
  .col-sm-3,
  .col-sm-4,
  .col-sm-5,
  .col-sm-6,
  .col-sm-7,
  .col-sm-8,
  .col-sm-9,
  .col-sm-auto,
  .col-xl,
  .col-xl-1,
  .col-xl-10,
  .col-xl-11,
  .col-xl-12,
  .col-xl-2,
  .col-xl-3,
  .col-xl-4,
  .col-xl-5,
  .col-xl-6,
  .col-xl-7,
  .col-xl-8,
  .col-xl-9,
  .col-xl-auto,
  .col-xxl,
  .col-xxl-1,
  .col-xxl-10,
  .col-xxl-11,
  .col-xxl-12,
  .col-xxl-2,
  .col-xxl-3,
  .col-xxl-4,
  .col-xxl-5,
  .col-xxl-6,
  .col-xxl-7,
  .col-xxl-8,
  .col-xxl-9,
  .col-xxl-auto {
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    width: 100%;
  }

  .sc-grid-col {
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
  }

  .col-auto {
    flex: 0 0 auto;
    max-width: none;
    width: auto;
  }

  .col-1 {
    flex: 0 0 8.3333333333%;
    max-width: 8.3333333333%;
  }

  .col-2 {
    flex: 0 0 16.6666666667%;
    max-width: 16.6666666667%;
  }

  .col-3 {
    flex: 0 0 25%;
    max-width: 25%;
  }

  .col-4 {
    flex: 0 0 33.3333333333%;
    max-width: 33.3333333333%;
  }

  .col-5 {
    flex: 0 0 41.6666666667%;
    max-width: 41.6666666667%;
  }

  .col-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }

  .col-7 {
    flex: 0 0 58.3333333333%;
    max-width: 58.3333333333%;
  }

  .col-8 {
    flex: 0 0 66.6666666667%;
    max-width: 66.6666666667%;
  }

  .col-9 {
    flex: 0 0 75%;
    max-width: 75%;
  }

  .col-10 {
    flex: 0 0 83.3333333333%;
    max-width: 83.3333333333%;
  }

  .col-11 {
    flex: 0 0 91.6666666667%;
    max-width: 91.6666666667%;
  }

  .col-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  @media (min-width: 576px) {
    .col-sm {
      flex-basis: 0;
      flex-grow: 1;
      max-width: 100%;
    }

    .col-sm-auto {
      flex: 0 0 auto;
      max-width: none;
      width: auto;
    }

    .col-sm-1 {
      flex: 0 0 8.3333333333%;
      max-width: 8.3333333333%;
    }

    .col-sm-2 {
      flex: 0 0 16.6666666667%;
      max-width: 16.6666666667%;
    }

    .col-sm-3 {
      flex: 0 0 25%;
      max-width: 25%;
    }

    .col-sm-4 {
      flex: 0 0 33.3333333333%;
      max-width: 33.3333333333%;
    }

    .col-sm-5 {
      flex: 0 0 41.6666666667%;
      max-width: 41.6666666667%;
    }

    .col-sm-6 {
      flex: 0 0 50%;
      max-width: 50%;
    }

    .col-sm-7 {
      flex: 0 0 58.3333333333%;
      max-width: 58.3333333333%;
    }

    .col-sm-8 {
      flex: 0 0 66.6666666667%;
      max-width: 66.6666666667%;
    }

    .col-sm-9 {
      flex: 0 0 75%;
      max-width: 75%;
    }

    .col-sm-10 {
      flex: 0 0 83.3333333333%;
      max-width: 83.3333333333%;
    }

    .col-sm-11 {
      flex: 0 0 91.6666666667%;
      max-width: 91.6666666667%;
    }

    .col-sm-12 {
      flex: 0 0 100%;
      max-width: 100%;
    }
  }

  @media (min-width: 768px) {
    .col-md {
      flex-basis: 0;
      flex-grow: 1;
      max-width: 100%;
    }

    .col-md-auto {
      flex: 0 0 auto;
      max-width: none;
      width: auto;
    }

    .col-md-1 {
      flex: 0 0 8.3333333333%;
      max-width: 8.3333333333%;
    }

    .col-md-2 {
      flex: 0 0 16.6666666667%;
      max-width: 16.6666666667%;
    }

    .col-md-3 {
      flex: 0 0 25%;
      max-width: 25%;
    }

    .col-md-4 {
      flex: 0 0 33.3333333333%;
      max-width: 33.3333333333%;
    }

    .col-md-5 {
      flex: 0 0 41.6666666667%;
      max-width: 41.6666666667%;
    }

    .col-md-6 {
      flex: 0 0 50%;
      max-width: 50%;
    }

    .col-md-7 {
      flex: 0 0 58.3333333333%;
      max-width: 58.3333333333%;
    }

    .col-md-8 {
      flex: 0 0 66.6666666667%;
      max-width: 66.6666666667%;
    }

    .col-md-9 {
      flex: 0 0 75%;
      max-width: 75%;
    }

    .col-md-10 {
      flex: 0 0 83.3333333333%;
      max-width: 83.3333333333%;
    }

    .col-md-11 {
      flex: 0 0 91.6666666667%;
      max-width: 91.6666666667%;
    }

    .col-md-12 {
      flex: 0 0 100%;
      max-width: 100%;
    }
  }

  @media (min-width: 992px) {
    .col-lg {
      flex-basis: 0;
      flex-grow: 1;
      max-width: 100%;
    }

    .col-lg-auto {
      flex: 0 0 auto;
      max-width: none;
      width: auto;
    }

    .col-lg-1 {
      flex: 0 0 8.3333333333%;
      max-width: 8.3333333333%;
    }

    .col-lg-2 {
      flex: 0 0 16.6666666667%;
      max-width: 16.6666666667%;
    }

    .col-lg-3 {
      flex: 0 0 25%;
      max-width: 25%;
    }

    .col-lg-4 {
      flex: 0 0 33.3333333333%;
      max-width: 33.3333333333%;
    }

    .col-lg-5 {
      flex: 0 0 41.6666666667%;
      max-width: 41.6666666667%;
    }

    .col-lg-6 {
      flex: 0 0 50%;
      max-width: 50%;
    }

    .col-lg-7 {
      flex: 0 0 58.3333333333%;
      max-width: 58.3333333333%;
    }

    .col-lg-8 {
      flex: 0 0 66.6666666667%;
      max-width: 66.6666666667%;
    }

    .col-lg-9 {
      flex: 0 0 75%;
      max-width: 75%;
    }

    .col-lg-10 {
      flex: 0 0 83.3333333333%;
      max-width: 83.3333333333%;
    }

    .col-lg-11 {
      flex: 0 0 91.6666666667%;
      max-width: 91.6666666667%;
    }

    .col-lg-12 {
      flex: 0 0 100%;
      max-width: 100%;
    }
  }

  @media (min-width: 1200px) {
    .col-xl {
      flex-basis: 0;
      flex-grow: 1;
      max-width: 100%;
    }

    .col-xl-auto {
      flex: 0 0 auto;
      max-width: none;
      width: auto;
    }

    .col-xl-1 {
      flex: 0 0 8.3333333333%;
      max-width: 8.3333333333%;
    }

    .col-xl-2 {
      flex: 0 0 16.6666666667%;
      max-width: 16.6666666667%;
    }

    .col-xl-3 {
      flex: 0 0 25%;
      max-width: 25%;
    }

    .col-xl-4 {
      flex: 0 0 33.3333333333%;
      max-width: 33.3333333333%;
    }

    .col-xl-5 {
      flex: 0 0 41.6666666667%;
      max-width: 41.6666666667%;
    }

    .col-xl-6 {
      flex: 0 0 50%;
      max-width: 50%;
    }

    .col-xl-7 {
      flex: 0 0 58.3333333333%;
      max-width: 58.3333333333%;
    }

    .col-xl-8 {
      flex: 0 0 66.6666666667%;
      max-width: 66.6666666667%;
    }

    .col-xl-9 {
      flex: 0 0 75%;
      max-width: 75%;
    }

    .col-xl-10 {
      flex: 0 0 83.3333333333%;
      max-width: 83.3333333333%;
    }

    .col-xl-11 {
      flex: 0 0 91.6666666667%;
      max-width: 91.6666666667%;
    }

    .col-xl-12 {
      flex: 0 0 100%;
      max-width: 100%;
    }
  }

  @media (min-width: 1800px) {
    .col-xxl {
      flex-basis: 0;
      flex-grow: 1;
      max-width: 100%;
    }

    .col-xxl-auto {
      flex: 0 0 auto;
      max-width: none;
      width: auto;
    }

    .col-xxl-1 {
      flex: 0 0 8.3333333333%;
      max-width: 8.3333333333%;
    }

    .col-xxl-2 {
      flex: 0 0 16.6666666667%;
      max-width: 16.6666666667%;
    }

    .col-xxl-3 {
      flex: 0 0 25%;
      max-width: 25%;
    }

    .col-xxl-4 {
      flex: 0 0 33.3333333333%;
      max-width: 33.3333333333%;
    }

    .col-xxl-5 {
      flex: 0 0 41.6666666667%;
      max-width: 41.6666666667%;
    }

    .col-xxl-6 {
      flex: 0 0 50%;
      max-width: 50%;
    }

    .col-xxl-7 {
      flex: 0 0 58.3333333333%;
      max-width: 58.3333333333%;
    }

    .col-xxl-8 {
      flex: 0 0 66.6666666667%;
      max-width: 66.6666666667%;
    }

    .col-xxl-9 {
      flex: 0 0 75%;
      max-width: 75%;
    }

    .col-xxl-10 {
      flex: 0 0 83.3333333333%;
      max-width: 83.3333333333%;
    }

    .col-xxl-11 {
      flex: 0 0 91.6666666667%;
      max-width: 91.6666666667%;
    }

    .col-xxl-12 {
      flex: 0 0 100%;
      max-width: 100%;
    }
  }
`;
