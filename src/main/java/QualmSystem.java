public class QualmSystem {
    private static final String QUALM_PATH = System.getenv("QUALM_PATH");

    private final String moduleDir;
    private final String moduleName;
    private PrologClient prolog;

    public QualmSystem(String moduleDir, String moduleName) {
        this.moduleDir = moduleDir;
        this.moduleName = moduleName;
    }

    public void init() {
        if (isInitialized()) {
            close();
        }
        prolog = new PrologClient(moduleDir);
        prolog.init();
        prolog.queryBool(String.format("assert(library_directory('%s'))", QUALM_PATH));
        prolog.queryBool("[main]");
//        logicPrograms.queryBool(String.format("construct(\"%s\")", moduleName));
        prolog.queryBool(String.format("initFile(%s)", moduleName));
        prolog.queryBool("[counterfactual]");
    }

    public void close() {
        if (isInitialized()) {
            prolog.close();
            prolog = null;
        }
    }

    public String query(String q) {
        return prolog.query(q);
    }

    public boolean queryBool(String q) {
        return prolog.queryBool(q);
    }

    public boolean isInitialized() {
        return prolog != null;
    }
}
