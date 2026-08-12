# analysis hooks guideline

## how to track PV (Page View)

1. add tracking hook on root node.

```js
const App = () => {
  usePageView();

  return <div id="app"></div>;
};
```

## how to track E2E latency

1. define user scenarios, e.g. in cashflow blotter, when user firstly open the tile, the rendering precess of whole page would be:
   1. user click menu or somewhere to open tile
   2. the first frame of cashflow blotter is rendered, but no any element on the page
   3. the biggest element of cashflow blotter is rendered, in this case it's blotter aggrid
   4. the cashflow blotter datas is rendered, user can view the blotter now
2. add tracking point using `useE2ELatency` hook to points defined above. For example,

   1. add first frame tracking point on App.tsx

   ```js
   const App = () => {
     const { initTrackingPoints, addTrackingPoint } = useE2Elatency(
       "Blotter Rendering Latency"
     );
     useEffect(() => {
       // if flag of initTrackingPoints is true, it will calculate the timecost against zero point on context.
       initTrackingPoints(true);
       addTrackingPoint("Render Page Frame");
     }, []);
   };
   ```

   2. add aggrid rendered tracking point

   ```js
   const useGridReadyEvent = () => {
     const { addTrackingPoint } = useE2Elatency("Blotter Rendering Latency");
     const onGridReady = () => {
       addTrackingPoint("Render Blotter Frame");
     };
   };
   ```

   3. add blotter data rendered tracking point

   ```js
   const { addTrackingPoint, completeTracking, abortTracking } = useE2Elatency(
     "Blotter Rendering Latency"
   );
   const initialBlotter = () => {
     queryBlotterData()
       .then((resp) => {
         addTrackingPoint("Render Blotter Client Data");
         completeTracking();
       })
       .catch(() => {
         // to abort the tracking in case it's running anyway.
         abortTracking();
       });
   };
   ```

## how to track RTT (round-trip time) or API timecost

add start tracking before api is sent, it will return complete and abort function. call complete when the api is succeed and call abort while it's failed.

```js
const { startTracking } = useRTT();

const somefunction = () => {
  const { completeTracking, abortTracking } = startTracking();
  queryDataApi()
    .then((resp) => {
      completeTracking({
        name: "Query Data API",
      });
    })
    .catch((error) => {
      abortTracking();
    });
};
```
