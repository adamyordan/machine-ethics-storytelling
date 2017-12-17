import spark.Spark;

import java.util.HashMap;
import java.util.Map;

import static spark.Spark.*;

public class App {
    final private static int MAX_SESSION = 500;
    final private String INPUT_FILE_DIR = System.getenv("LOGIC_PROGRAMS_PATH");
    private Map<String, QualmSystem> qualmMap;

    public static void main(String[] args) {
        App app = new App();
        app.run();
    }

    public App() {
        qualmMap = new HashMap<>();
    }

    public void run() {
        initSimulation();
        initRouteQualm();
    }

    private void initRouteQualm() {
        get("/qualm/init", (req, res) -> {
            if (qualmMap.size() > MAX_SESSION) {
                qualmMap.clear();
            }

            String moduleName = req.queryParams("module");
            if (moduleName == null) {
                return "no";
            }
            moduleName = moduleName.trim();

            QualmSystem qualm = new QualmSystem(INPUT_FILE_DIR, moduleName);
            qualm.init();

            String qualmId = req.queryParams("id") == null ? req.queryParams("id") : "default";
            qualmMap.put(qualmId, qualm);

            return "yes";
        });

        get("/qualm/close", (req, res) -> {
            String qualmId = req.queryParams("id") == null ? req.queryParams("id") : "default";
            if (qualmMap.containsKey(qualmId)) {
                qualmMap.get(qualmId).close();
                return "yes";
            } else {
                return "no";
            }
        });

        get("/qualm/query", (req, res) -> {
            String qualmId = req.queryParams("id") == null ? req.queryParams("id") : "default";
            QualmSystem qualm = qualmMap.get(qualmId);
            if (qualm == null || !qualm.isInitialized()) {
                return "qualm not initialized";
            }

            String q = req.queryParams("q");
            if (q == null || q.isEmpty()) {
                return "";
            }
            q = q.trim().replace(".", "");

            if (!q.contains("X")) {
                return qualm.queryBool(q) ? "yes" : "no";
            } else {
                String result = qualm.query(q);
                return (result != null) ? "X = " + result : "no";
            }
        });
    }

    private void initSimulation() {
        Spark.staticFileLocation("/public");
    }
}
