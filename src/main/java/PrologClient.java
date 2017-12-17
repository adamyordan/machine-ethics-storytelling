import com.declarativa.interprolog.PrologEngine;
import com.declarativa.interprolog.SolutionIterator;
import com.declarativa.interprolog.XSBSubprocessEngine;

public class PrologClient {
    private static final String XSB_PATH = System.getenv("XSB_PATH");

    private final PrologEngine engine = new XSBSubprocessEngine(XSB_PATH);
    private final String dir;

    public PrologClient(String dir) {
        this.dir = dir;
    }

    public void init() {
        if (dir != null) {
            engine.deterministicGoal(String.format("assert(library_directory('%s'))", dir));
        }
    }

    public void close() {
        engine.shutdown();
    }

    public String query(String query) {
        SolutionIterator solutions = engine.goal(String.format("%s, buildTermModel(X,TM)", query), "[TM]");
        while (solutions.hasNext()) {
            Object[] solution = solutions.next();
            if (solution != null && solution.length > 0) {
                return solution[0].toString();
            }
        }
        return null;
    }

    public boolean queryBool(String query) {
        return engine.deterministicGoal(query);
    }
}
