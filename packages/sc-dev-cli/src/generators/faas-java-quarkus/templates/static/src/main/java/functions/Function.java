package functions;

import io.quarkus.funqy.Funq;

public class Function {

    /**
     * Your function is accessible via /api/function/v1/yourFunctionName?param=<param>
     * Please update /resources/application.properties as per your function settings
     *
     * @param input
     * @return output
     */
    @Funq("yourFunctionName")
    public Output yourFunctionName(Input input) {
        Output result = Output.builder()
                .message(input.getParam())
                .build();
        return result;
    }
}
