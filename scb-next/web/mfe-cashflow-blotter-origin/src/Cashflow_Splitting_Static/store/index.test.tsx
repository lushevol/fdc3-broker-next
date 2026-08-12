import createStore, {
    addAppListener,
    startAppListening,
    useAppDispatch,
    useAppSelector,
} from "./index";
import { searchSlice } from "./search.slice";

vi.mock('react-redux', () => ({
  useDispatch: () => vi.fn(),
  useSelector: () => vi.fn(),
}));

describe("Redux store setup", () => {
    it("should create a store with expected slices", () => {
        const store = createStore();
        const state = store.getState();
        expect(state).toHaveProperty(searchSlice.name);
    });

    it("should dispatch actions and update state", () => {
         const store = createStore();
        const action = searchSlice.actions.setSearchQuery({ test: 123 });
        store.dispatch(action);
        const state = store.getState();
        expect(state[searchSlice.name].searchQuery).toEqual({ test: 123 });
    });

    it("useAppDispatch should return dispatch function", () => {
        const dispatch = useAppDispatch();
        expect(typeof dispatch).toBe("function");
    });

    it("startAppListening and addAppListener should be functions", () => {
        expect(typeof startAppListening).toBe("function");
        expect(typeof addAppListener).toBe("function");
    });
});