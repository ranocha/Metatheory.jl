var documenterSearchIndex = {"docs":
[{"location":"theories/#Rules-and-Theories","page":"Rules and Theories","title":"Rules and Theories","text":"","category":"section"},{"location":"theories/#Rule-Syntax-for-Classical-Rewriting","page":"Rules and Theories","title":"Rule Syntax for Classical Rewriting","text":"","category":"section"},{"location":"theories/","page":"Rules and Theories","title":"Rules and Theories","text":"Kind Supported in Left Hand Side Operator Supported in Right Hand Side\nSymbolic  Rule x  (pattern variables)  :foo (symbol literals)  x::Type (type assertions)  $(2 + 3) (unquoting)  a... (pattern variable destructuring, matches many subterms as a tuple)   Other literals are supported. => x (pattern variables)  :foo(symbol literals)  a... (pattern variable destructuring)   $(2 + 3) (unquoting)  Other literals are supported.\nDynamic Rule Same as above |> Dynamic rules can execute all valid Julia code. The pattern variables  that matched are available (bound) in the r.h.s.. Other global variables  in the execution module are bound. An additional variable _lhs_expr is bound, referring to the left hand side that matched the rule.\nEquational Rule Unsupported == Unsupported","category":"page"},{"location":"theories/#Rule-Syntax-for-EGraphs-Rewriting","page":"Rules and Theories","title":"Rule Syntax for EGraphs Rewriting","text":"","category":"section"},{"location":"theories/","page":"Rules and Theories","title":"Rules and Theories","text":"Kind Supported in  Left Hand Side Operator Supported in Right Hand Side\nSymbolic  Rule x  (pattern variables)  :foo (symbol literals)  x::Type (type assertions)  $(2 + 3) (unquoting)   Other literals are supported. Pattern variable destructuring is not supported. => x (pattern variables)  :foo(symbol literals)   $(2 + 3) (unquoting)  Other literals are supported.\nDynamic Rule Same as above |> Dynamic rules execute valid Julia code. The pattern variables  that matched are available (bound) in the r.h.s.. Other global variables  in the execution module are bound. An additional variable _lhs_expr is bound,  referring to the left hand side that matched the rule.  NOTE: additionally, the _egraph variable is bound,  referring to the current EGraph on which rewriting is happening.\nEquational Rule Same as Symbolic Rules. == Same as left hand side of symbolic rules.","category":"page"},{"location":"theories/#Theories-are-Collections-and-Composable","page":"Rules and Theories","title":"Theories are Collections and Composable","text":"","category":"section"},{"location":"theories/","page":"Rules and Theories","title":"Rules and Theories","text":"Theories are just collections, precisely vectors of the Rule object, and can be composed as regular Julia collections. The most useful way of composing theories is unioning them with the '∪' operator. You are not limited to composing theories, you can manipulate and create them at both runtime and compile time as regular vectors.","category":"page"},{"location":"theories/","page":"Rules and Theories","title":"Rules and Theories","text":"using Metatheory\nusing Metatheory.EGraphs\nusing Metatheory.Library\n\ncomm_monoid = commutative_monoid(:(*), 1);\ncomm_group = @theory begin\n    a + 0 => a\n    a + b => b + a\n    a + inv(a) => 0 # inverse\n    a + (b + c) => (a + b) + c\nend\ndistrib = @theory begin\n    a * (b + c) => (a * b) + (a * c)\nend\nt = comm_monoid ∪ comm_group ∪ distrib","category":"page"},{"location":"theories/#Type-Assertions-and-Dynamic-Rules","page":"Rules and Theories","title":"Type Assertions and Dynamic Rules","text":"","category":"section"},{"location":"theories/","page":"Rules and Theories","title":"Rules and Theories","text":"You can use type assertions in the left hand of rules to match and access literal values both when using classic rewriting and EGraph based rewriting.","category":"page"},{"location":"theories/","page":"Rules and Theories","title":"Rules and Theories","text":"You can also use dynamic rules, defined with the |> operator, to dynamically compute values in the right hand of expressions. Dynamic rules, are similar to anonymous functions. Instead of a symbolic substitution, the right hand of a dynamic |> rule is evaluated during rewriting: the values that produced a match are bound to the pattern variables.","category":"page"},{"location":"theories/","page":"Rules and Theories","title":"Rules and Theories","text":"fold_mul = @theory begin\n    a::Number * b::Number |> a*b\nend\nt = comm_monoid ∪ fold_mul\n@areequal t (3*4) 12","category":"page"},{"location":"theories/#Escaping","page":"Rules and Theories","title":"Escaping","text":"","category":"section"},{"location":"theories/","page":"Rules and Theories","title":"Rules and Theories","text":"You can escape values in the left hand side of rules using $ just as you would do with the regular quoting/unquoting mechanism.","category":"page"},{"location":"theories/","page":"Rules and Theories","title":"Rules and Theories","text":"example = @theory begin\n    a + $(3+2) |> :something\nend","category":"page"},{"location":"theories/#Patterns","page":"Rules and Theories","title":"Patterns","text":"","category":"section"},{"location":"theories/","page":"Rules and Theories","title":"Rules and Theories","text":"Modules = [Rules]\nPages = [\"patterns.jl\", \"patterns_syntax.jl\"]","category":"page"},{"location":"theories/#Rules","page":"Rules and Theories","title":"Rules","text":"","category":"section"},{"location":"theories/","page":"Rules and Theories","title":"Rules and Theories","text":"Modules = [Rules]\nPages = [\"rule_types.jl\", \"rule_dsl.jl\"]","category":"page"},{"location":"theories/#Metatheory.Rules.DynamicRule","page":"Rules and Theories","title":"Metatheory.Rules.DynamicRule","text":"Rules defined as left_hand |> right_hand are called dynamic rules. Dynamic rules behave like anonymous functions. Instead of a symbolic substitution, the right hand of a dynamic |> rule is evaluated during rewriting: matched values are bound to pattern variables as in a regular function call. This allows for dynamic computation of right hand sides.\n\nDynamic rule\n\nRule(:(a::Number * b::Number |> a*b))\n\n\n\n\n\n","category":"type"},{"location":"theories/#Metatheory.Rules.EqualityRule","page":"Rules and Theories","title":"Metatheory.Rules.EqualityRule","text":"Rule(:(a * b == b * a))\n\n\n\n\n\n","category":"type"},{"location":"theories/#Metatheory.Rules.RewriteRule","page":"Rules and Theories","title":"Metatheory.Rules.RewriteRule","text":"Rules defined as left_hand => right_hand are called symbolic rewrite rules. Application of a rewrite Rule is a replacement of the left_hand pattern with the right_hand substitution, with the correct instantiation of pattern variables. Function call symbols are not treated as pattern variables, all other identifiers are treated as pattern variables. Literals such as 5, :e, \"hello\" are not treated as pattern variables.\n\nRule(:(a * b => b * a))\n\n\n\n\n\n","category":"type"},{"location":"theories/#Metatheory.Rules.UnequalRule","page":"Rules and Theories","title":"Metatheory.Rules.UnequalRule","text":"This type of anti-rules is used for checking contradictions in the EGraph backend. If two terms, corresponding to the left and right hand side of an anti-rule are found in an [EGraph], saturation is halted immediately. \n\n\n\n\n\n","category":"type"},{"location":"theories/#Metatheory.Rules.Theory","page":"Rules and Theories","title":"Metatheory.Rules.Theory","text":"A Theory is either a vector of Rule or a compiled, callable function.\n\n\n\n\n\n","category":"type"},{"location":"theories/#Metatheory.Rules.Rule","page":"Rules and Theories","title":"Metatheory.Rules.Rule","text":"Construct an AbstractRule from a quoted expression. You can also use the [@rule] macro to create a Rule.\n\n\n\n\n\n","category":"function"},{"location":"theories/#Metatheory.Rules.gettheory-Tuple{Any, Any}","page":"Rules and Theories","title":"Metatheory.Rules.gettheory","text":"Retrieve a theory from a module at compile time. TODO cleanup\n\n\n\n\n\n","category":"method"},{"location":"analysis/#E-Graph-Analysis","page":"E-Graph Analysis","title":"E-Graph Analysis","text":"","category":"section"},{"location":"analysis/","page":"E-Graph Analysis","title":"E-Graph Analysis","text":"Modules = [EGraphs]\nPages = [\"abstractanalysis.jl\", \"analysis.jl\"]","category":"page"},{"location":"analysis/#Metatheory.EGraphs.analyze!-Tuple{EGraph, Type{var\"#s206\"} where var\"#s206\"<:AbstractAnalysis, Vector{Int64}}","page":"E-Graph Analysis","title":"Metatheory.EGraphs.analyze!","text":"WARNING. This function is unstable. An EGraph can only contain one analysis of type an.\n\n\n\nSignatures\n\nanalyze!(g::EGraph, an::Type{var\"#s206\"} where var\"#s206\"<:AbstractAnalysis, ids::Vector{Int64}) -> Bool\n\n\n\n\nMethods\n\nanalyze!(g, an, ids)\n\ndefined at /home/runner/work/Metatheory.jl/Metatheory.jl/src/EGraphs/analysis.jl:14.\n\n\n\n\n\n","category":"method"},{"location":"egraphs/#EGraphs-and-Equality-Saturation","page":"EGraphs and Equality Saturation","title":"EGraphs and Equality Saturation","text":"","category":"section"},{"location":"egraphs/","page":"EGraphs and Equality Saturation","title":"EGraphs and Equality Saturation","text":"An EGraph is an efficient data structure for representing congruence relations. EGraphs are data structures originating from theorem provers. Several projects have very recently  repurposed EGraphs to implement state-of-the-art, rewrite-driven compiler optimizations and program synthesizers using a technique known as equality saturation. Metatheory.jl provides a general purpose, customizable implementation of EGraphs and equality saturation, inspired from the egg library for Rust. You can read more about the design of the EGraph data structure and equality saturation algorithm in the egg paper.","category":"page"},{"location":"egraphs/#What-can-I-do-with-EGraphs-in-Metatheory.jl?","page":"EGraphs and Equality Saturation","title":"What can I do with EGraphs in Metatheory.jl?","text":"","category":"section"},{"location":"egraphs/","page":"EGraphs and Equality Saturation","title":"EGraphs and Equality Saturation","text":"Most importantly, the EGraph backend for Metatheory.jl allows you to create an EGraph from a starting expression, to add more expressions to the EGraph with addexpr!, and then to effectively fill the EGraph with all possible equivalent expressions resulting from applying rewrite rules from a theory, by using the saturate! function. You can then easily extract expressions with a cost function and an ExtractionAnalysis.","category":"page"},{"location":"egraphs/","page":"EGraphs and Equality Saturation","title":"EGraphs and Equality Saturation","text":"A killer feature of egg and Metatheory.jl are EGraph Analyses. They allow you to annotate expressions and equivalence classes in an EGraph with values from a semilattice domain, and then to:","category":"page"},{"location":"egraphs/","page":"EGraphs and Equality Saturation","title":"EGraphs and Equality Saturation","text":"Extract expressions from an EGraph basing from analysis data.\nHave conditional rules that are executed if some criteria is met on analysis data\nHave dynamic rules that compute the right hand side based on analysis data.","category":"page"},{"location":"egraphs/#Theories-and-Algebraic-Structures","page":"EGraphs and Equality Saturation","title":"Theories and Algebraic Structures","text":"","category":"section"},{"location":"egraphs/","page":"EGraphs and Equality Saturation","title":"EGraphs and Equality Saturation","text":"The e-graphs backend can directly handle associativity, commutativity and distributivity, rules that are otherwise known of causing loops in symbolic computations.","category":"page"},{"location":"egraphs/","page":"EGraphs and Equality Saturation","title":"EGraphs and Equality Saturation","text":"comm_monoid = @theory begin\n    a * b => b * a\n    a * 1 => a\n    a * (b * c) => (a * b) * c\nend","category":"page"},{"location":"egraphs/#The-Metatheory-Library","page":"EGraphs and Equality Saturation","title":"The Metatheory Library","text":"","category":"section"},{"location":"egraphs/","page":"EGraphs and Equality Saturation","title":"EGraphs and Equality Saturation","text":"The Metatheory.Library module contains utility functions and macros for creating rules and theories from commonly used algebraic structures and properties.","category":"page"},{"location":"egraphs/","page":"EGraphs and Equality Saturation","title":"EGraphs and Equality Saturation","text":"using Metatheory.Library\n\ncomm_monoid = commutative_monoid(:(*), 1)\n# alternatively\ncomm_monoid = @commutative_monoid (*) 1","category":"page"},{"location":"egraphs/#Equality-Saturation","page":"EGraphs and Equality Saturation","title":"Equality Saturation","text":"","category":"section"},{"location":"egraphs/","page":"EGraphs and Equality Saturation","title":"EGraphs and Equality Saturation","text":"We can programmatically build and saturate an EGraph. The function saturate! takes an EGraph and a theory, and executes equality saturation. Returns a report of the equality saturation process. saturate! is configurable, customizable parameters include a timeout on the number of iterations, a eclasslimit on the number of e-classes in the EGraph, a stopwhen functions that stops saturation when it evaluates to true.","category":"page"},{"location":"egraphs/","page":"EGraphs and Equality Saturation","title":"EGraphs and Equality Saturation","text":"G = EGraph(:((a * b) * (1 * (b + c))));\nreport = saturate!(G, t);\n# access the saturated EGraph\nreport.egraph\n\n# show some fancy stats\nprintln(report);\n","category":"page"},{"location":"egraphs/","page":"EGraphs and Equality Saturation","title":"EGraphs and Equality Saturation","text":"With the EGraph equality saturation backend, Metatheory.jl can prove simple equalities very efficiently. The @areequal macro takes a theory and some expressions and returns true iff the expressions are equal according to the theory. The following example returns true.","category":"page"},{"location":"egraphs/","page":"EGraphs and Equality Saturation","title":"EGraphs and Equality Saturation","text":"@areequal t (x+y)*(a+b) ((a*(x+y))+b*(x+y)) ((x*(a+b))+y*(a+b))","category":"page"},{"location":"egraphs/#Configurable-Parameters","page":"EGraphs and Equality Saturation","title":"Configurable Parameters","text":"","category":"section"},{"location":"egraphs/","page":"EGraphs and Equality Saturation","title":"EGraphs and Equality Saturation","text":"EGraphs.saturate! can accept an additional parameter of type EGraphs.SaturationParams to configure the equality saturation algorithm. The documentation for the configurable parameters is available in the EGraphs.SaturationParams API docstring.","category":"page"},{"location":"egraphs/","page":"EGraphs and Equality Saturation","title":"EGraphs and Equality Saturation","text":"# create the saturation params\nparams = SaturationParams(timeout=10, eclasslimit=4000)\nsaturate!(egraph, theory, params)","category":"page"},{"location":"egraphs/#API-Docs","page":"EGraphs and Equality Saturation","title":"API Docs","text":"","category":"section"},{"location":"egraphs/","page":"EGraphs and Equality Saturation","title":"EGraphs and Equality Saturation","text":"Modules = [Metatheory.EGraphs]\nPublic = true\nPages = [\"egg.jl\", \"saturation.jl\"]","category":"page"},{"location":"egraphs/#Metatheory.EGraphs.eqsat_step!-Tuple{EGraph, Vector{var\"#s278\"} where var\"#s278\"<:AbstractRule, Any, Metatheory.EGraphs.Schedulers.AbstractScheduler, Vector{Metatheory.EGraphs.Match}, SaturationParams, Any}","page":"EGraphs and Equality Saturation","title":"Metatheory.EGraphs.eqsat_step!","text":"Core algorithm of the library: the equality saturation step.\n\n\n\nSignatures\n\neqsat_step!(g::EGraph, theory::Vector{var\"#s278\"} where var\"#s278\"<:AbstractRule, curr_iter, scheduler::Metatheory.EGraphs.Schedulers.AbstractScheduler, match_hist::Vector{Metatheory.EGraphs.Match}, params::SaturationParams, report) -> Tuple{Any, EGraph}\n\n\n\n\nMethods\n\neqsat_step!(g, theory, curr_iter, scheduler, match_hist, params, report)\n\ndefined at /home/runner/work/Metatheory.jl/Metatheory.jl/src/EGraphs/saturation/saturation.jl:10.\n\n\n\n\n\n","category":"method"},{"location":"egraphs/#Metatheory.EGraphs.saturate!","page":"EGraphs and Equality Saturation","title":"Metatheory.EGraphs.saturate!","text":"Given an EGraph and a collection of rewrite rules, execute the equality saturation algorithm.\n\n\n\nSignatures\n\nsaturate!(g::EGraph, theory::Vector{var\"#s276\"} where var\"#s276\"<:AbstractRule) -> Metatheory.EGraphs.Report\nsaturate!(g::EGraph, theory::Vector{var\"#s275\"} where var\"#s275\"<:AbstractRule, params) -> Metatheory.EGraphs.Report\n\n\n\n\nMethods\n\nsaturate!(g, theory)\nsaturate!(g, theory, params)\n\ndefined at /home/runner/work/Metatheory.jl/Metatheory.jl/src/EGraphs/saturation/saturation.jl:39.\n\n\n\n\n\n","category":"function"},{"location":"classic/#Classical-Rewriting","page":"Classical Rewriting","title":"Classical Rewriting","text":"","category":"section"},{"location":"classic/","page":"Classical Rewriting","title":"Classical Rewriting","text":"CurrentModule = Metatheory\nDocTestSetup  = quote\n    using Metatheory\n    using Metatheory.EGraphs\nend","category":"page"},{"location":"classic/","page":"Classical Rewriting","title":"Classical Rewriting","text":"There are some use cases where EGraphs and equality saturation are not required. The classical rewriting backend is suited for simple tasks when computing the whole equivalence class is overkill.","category":"page"},{"location":"classic/","page":"Classical Rewriting","title":"Classical Rewriting","text":"The classical rewriting backend can be accessed with the rewrite function, which uses a recursive fixed point iteration algorithm to rewrite a source expression. The expression can be traversed with a depth first (inner left expression) evaluation order, or with a breadth first (outer left expression) evaluation order. You can configure the evaluation order by passing the keyword argument order=:inner (default) or order=:outer to the rewrite function.","category":"page"},{"location":"classic/","page":"Classical Rewriting","title":"Classical Rewriting","text":"Note: With the classical rewrite algorithm, rules are matched in order and applied deterministically: every iteration, only the first rule that matches is applied. This means that when using the classical rewriting backend, the ordering of rules in a theory matters!. If some rules produce a loop, which is common for regular algebraic rules such as commutativity, distributivity and associativity, the other following rules in the theory will never be applied.","category":"page"},{"location":"classic/","page":"Classical Rewriting","title":"Classical Rewriting","text":"The classical rewrite algorithm is suitable for:","category":"page"},{"location":"classic/","page":"Classical Rewriting","title":"Classical Rewriting","text":"Simple Pattern Matching Tasks\nInterpretation of Code (e.g. interpretation of an eDSL)\nNon-Optimizing Compiler Steps and Transformations (e.g. Your eDSL –> Julia)\nSimple Deterministic Manipulation Tasks (e.g. cleaning expressions)","category":"page"},{"location":"classic/","page":"Classical Rewriting","title":"Classical Rewriting","text":"For algebraic, mathematics oriented rewriting, please use the EGraph backend.","category":"page"},{"location":"classic/","page":"Classical Rewriting","title":"Classical Rewriting","text":"Rewriting loops are detected by keeping an history of hashes of the rewritten expression. When a loop is detected, rewriting stops immediately and returns the current expression.","category":"page"},{"location":"classic/","page":"Classical Rewriting","title":"Classical Rewriting","text":"Metatheory.jl is meant for composability: you can always compose and interleave rewriting steps that use the classical rewriting backend or the more advanced EGraph backend.","category":"page"},{"location":"classic/#Example","page":"Classical Rewriting","title":"Example","text":"","category":"section"},{"location":"classic/","page":"Classical Rewriting","title":"Classical Rewriting","text":"Let's simplify an expression in the comm_monoid theory by using the EGraph backend. After simplification, we may want to move all the σ symbols to the right of multiplications, we can do this simple task with a classical rewriting step, by using the rewrite function.","category":"page"},{"location":"classic/#Step-1:-Simplification-with-EGraphs","page":"Classical Rewriting","title":"Step 1: Simplification with EGraphs","text":"","category":"section"},{"location":"classic/","page":"Classical Rewriting","title":"Classical Rewriting","text":"using Metatheory\nusing Metatheory.EGraphs\nusing Metatheory.Classic\nusing Metatheory.Library\n\n@metatheory_init\n\ncomm_monoid = commutative_monoid(:(*), 1);\nstart_expr = :( (a * (1 * (2σ)) * (b * σ + (c * 1)) ) );\ng = EGraph(start_expr);\nsaturate!(g, comm_monoid);\nsimplified = extract!(g, astsize)","category":"page"},{"location":"classic/#Step-2:-Moving-σ-to-the-right","page":"Classical Rewriting","title":"Step 2: Moving σ to the right","text":"","category":"section"},{"location":"classic/","page":"Classical Rewriting","title":"Classical Rewriting","text":"moveright = @theory begin\n\t:σ * a \t\t\t=> a*:σ\n\t(a * :σ) * b \t=> (a * b) * :σ\n\t(:σ * a) * b \t=> (a * b) * :σ\nend;\n\nsimplified = rewrite(simplified, moveright)","category":"page"},{"location":"classic/#Assignment-to-variables-during-rewriting.","page":"Classical Rewriting","title":"Assignment to variables during rewriting.","text":"","category":"section"},{"location":"classic/","page":"Classical Rewriting","title":"Classical Rewriting","text":"Using the classical rewriting backend, you may want to assign a value to an externally defined variable. Because of the nature of modules and the RuntimeGeneratedFunction compilation pipeline, it is not possible to assign values to variables in other modules. You can achieve such behaviour by using Julia References (docs), which behave similarly to pointers in other languages such as C or OCaml.","category":"page"},{"location":"classic/","page":"Classical Rewriting","title":"Classical Rewriting","text":"Note: due to nondeterminism, it is unrecommended to assign values to Refs when using the EGraph backend!","category":"page"},{"location":"classic/","page":"Classical Rewriting","title":"Classical Rewriting","text":"safe_var = 0\nref_var = Ref{Real}(0)\n\nreft = @theory begin\n\t:safe |> (safe_var = π)\n\t:ref |> (ref_var[] = π)\nend\n\nrewrite(:(safe), reft; order=:inner, m=@__MODULE__)\nrewrite(:(ref), reft; order=:inner, m=@__MODULE__)\n\n(safe_var, ref_var[])","category":"page"},{"location":"classic/#A-Tiny-Imperative-Programming-Language-Interpreter","page":"Classical Rewriting","title":"A Tiny Imperative Programming Language Interpreter","text":"","category":"section"},{"location":"classic/","page":"Classical Rewriting","title":"Classical Rewriting","text":"Here is an example showing interpretation of a very tiny, turing complete subset of the Julia programming language. To achieve turing completeness in an imperative paradigm language, just integer+boolean arithmetic and if and while statements are needed. Since a recursive algorithm is sufficient for interpreting those expressions, this example does not use the e-graphs backend! Note how we are representing semantics for a different programming language by reusing the Julia AST data structure, and therefore efficiently reusing the Julia parser for our new toy language.","category":"page"},{"location":"classic/","page":"Classical Rewriting","title":"Classical Rewriting","text":"See this test file.","category":"page"},{"location":"classic/#API-Docs","page":"Classical Rewriting","title":"API Docs","text":"","category":"section"},{"location":"classic/","page":"Classical Rewriting","title":"Classical Rewriting","text":"CurrentModule = Metatheory","category":"page"},{"location":"classic/","page":"Classical Rewriting","title":"Classical Rewriting","text":"Modules = [Metatheory.Classic]","category":"page"},{"location":"extraction/#Extracting-from-an-E-Graph","page":"Extracting from an E-Graph","title":"Extracting from an E-Graph","text":"","category":"section"},{"location":"extraction/","page":"Extracting from an E-Graph","title":"Extracting from an E-Graph","text":"Extraction can be formulated as an EGraph analysis, or after saturation. A cost function can be provided. Metatheory.jl already provides some simple cost functions, such as astsize, which expresses preference for the smallest expressions.","category":"page"},{"location":"extraction/","page":"Extracting from an E-Graph","title":"Extracting from an E-Graph","text":"Given the theory:","category":"page"},{"location":"extraction/","page":"Extracting from an E-Graph","title":"Extracting from an E-Graph","text":"using Metatheory\nusing Metatheory.Library\nusing Metatheory.EGraphs\n\n@metatheory_init\n\ncomm_monoid = commutative_monoid(:(*), 1);\ncomm_group = @theory begin\n    a + 0 => a\n    a + b => b + a\n    a + inv(a) => 0 # inverse\n    a + (b + c) => (a + b) + c\nend\ndistrib = @theory begin\n\ta * (b + c) => (a * b) + (a * c)\n\t(a * b) + (a * c) => a * (b + c)\nend\npowers = @theory begin\n\ta * a => a^2\n\ta => a^1\n\ta^n * a^m => a^(n+m)\nend\nlogids = @theory begin\n\tlog(a^n) => n * log(a)\n\tlog(x * y) => log(x) + log(y)\n\tlog(1) => 0\n\tlog(:e) => 1\n\t:e^(log(x)) => x\nend\nfold = @theory begin\n\ta::Number + b::Number |> a + b\n\ta::Number * b::Number |> a * b\nend\nt = comm_monoid ∪ comm_group ∪ distrib ∪ powers ∪ logids ∪ fold ;\nnothing # hide","category":"page"},{"location":"extraction/","page":"Extracting from an E-Graph","title":"Extracting from an E-Graph","text":"We can extract an expression by using","category":"page"},{"location":"extraction/","page":"Extracting from an E-Graph","title":"Extracting from an E-Graph","text":"G = EGraph(:((log(e) * log(e)) * (log(a^3 * a^2))))\nsaturate!(G, t)\nex = extract!(G, astsize)","category":"page"},{"location":"extraction/","page":"Extracting from an E-Graph","title":"Extracting from an E-Graph","text":"The second argument to extract! is a cost function. astsize is  a cost function provided by default, which computes the size of expressions.","category":"page"},{"location":"extraction/#Defining-custom-cost-functions","page":"Extracting from an E-Graph","title":"Defining custom cost functions","text":"","category":"section"},{"location":"extraction/","page":"Extracting from an E-Graph","title":"Extracting from an E-Graph","text":"TODO","category":"page"},{"location":"extraction/#API-Docs","page":"Extracting from an E-Graph","title":"API Docs","text":"","category":"section"},{"location":"extraction/","page":"Extracting from an E-Graph","title":"Extracting from an E-Graph","text":"Modules = [EGraphs]\nPages = [\"extraction.jl\"]","category":"page"},{"location":"extraction/#Metatheory.EGraphs.ExtractionAnalysis","page":"Extracting from an E-Graph","title":"Metatheory.EGraphs.ExtractionAnalysis","text":"An AbstractAnalysis that computes the cost of expression nodes and chooses the node with the smallest cost for each E-Class. This abstract type is parametrised by a function F. This is useful for the analysis storage in EClass\n\n\n\n\n\n","category":"type"},{"location":"extraction/#Metatheory.EGraphs.astsize-Tuple{ENode, EGraph, Type{var\"#s277\"} where var\"#s277\"<:AbstractAnalysis}","page":"Extracting from an E-Graph","title":"Metatheory.EGraphs.astsize","text":"A basic cost function, where the computed cost is the size (number of children) of the current expression.\n\n\n\nSignatures\n\nastsize(n::ENode, g::EGraph, an::Type{var\"#s277\"} where var\"#s277\"<:AbstractAnalysis) -> Any\n\n\n\n\nMethods\n\nastsize(n, g, an)\n\ndefined at /home/runner/work/Metatheory.jl/Metatheory.jl/src/EGraphs/extraction.jl:5.\n\n\n\n\n\n","category":"method"},{"location":"extraction/#Metatheory.EGraphs.astsize_inv-Tuple{ENode, EGraph, Type{var\"#s277\"} where var\"#s277\"<:AbstractAnalysis}","page":"Extracting from an E-Graph","title":"Metatheory.EGraphs.astsize_inv","text":"A basic cost function, where the computed cost is the size (number of children) of the current expression, times -1. Strives to get the largest expression\n\n\n\nSignatures\n\nastsize_inv(n::ENode, g::EGraph, an::Type{var\"#s277\"} where var\"#s277\"<:AbstractAnalysis) -> Any\n\n\n\n\nMethods\n\nastsize_inv(n, g, an)\n\ndefined at /home/runner/work/Metatheory.jl/Metatheory.jl/src/EGraphs/extraction.jl:20.\n\n\n\n\n\n","category":"method"},{"location":"extraction/#Metatheory.EGraphs.extract!-Tuple{EGraph, Function}","page":"Extracting from an E-Graph","title":"Metatheory.EGraphs.extract!","text":"Given a cost function, extract the expression with the smallest computed cost from an EGraph\n\n\n\nSignatures\n\nextract!(g::EGraph, costfun::Function; root) -> Any\n\n\n\n\nMethods\n\nextract!(g, costfun; root)\n\ndefined at /home/runner/work/Metatheory.jl/Metatheory.jl/src/EGraphs/extraction.jl:105.\n\n\n\n\n\n","category":"method"},{"location":"extraction/#Metatheory.EGraphs.extract!-Tuple{EGraph, Type{ExtractionAnalysis{F}} where F}","page":"Extracting from an E-Graph","title":"Metatheory.EGraphs.extract!","text":"Given an ExtractionAnalysis, extract the expression with the smallest computed cost from an EGraph\n\n\n\nSignatures\n\nextract!(g::EGraph, a::Type{ExtractionAnalysis{F}} where F; root) -> Any\n\n\n\n\nMethods\n\nextract!(g, a; root)\n\ndefined at /home/runner/work/Metatheory.jl/Metatheory.jl/src/EGraphs/extraction.jl:90.\n\n\n\n\n\n","category":"method"},{"location":"options/#Global-Metatheory.jl-Options","page":"Global Metatheory.jl Options","title":"Global Metatheory.jl Options","text":"","category":"section"},{"location":"options/","page":"Global Metatheory.jl Options","title":"Global Metatheory.jl Options","text":"CurrentModule = Metatheory","category":"page"},{"location":"options/","page":"Global Metatheory.jl Options","title":"Global Metatheory.jl Options","text":"Modules = [Metatheory]","category":"page"},{"location":"options/#Metatheory.Options","page":"Global Metatheory.jl Options","title":"Metatheory.Options","text":"mutable struct Options\n\nGlobal configurable options for Metatheory.\n\n\n\nFields\n\nverbose::Bool\nPrint or not information such as saturation reports  Default: false\nprintiter::Bool\nPrint iteration numbers in equality saturation  Default: false\n\n\n\n\n\n","category":"type"},{"location":"#Metatheory.jl","page":"Metatheory.jl","title":"Metatheory.jl","text":"","category":"section"},{"location":"","page":"Metatheory.jl","title":"Metatheory.jl","text":"<p align=\"center\">\n<img width=\"400px\" src=\"https://raw.githubusercontent.com/0x0f0f0f/Metatheory.jl/master/docs/src/assets/dragon.jpg\"/>\n</p>","category":"page"},{"location":"","page":"Metatheory.jl","title":"Metatheory.jl","text":"Metatheory.jl is a general purpose metaprogramming and algebraic computation library for the Julia programming language, designed to take advantage of the powerful reflection capabilities to bridge the gap between symbolic mathematics, abstract interpretation, equational reasoning, optimization, composable compiler transforms, and advanced homoiconic pattern matching features. The core feature of Metatheory.jl is e-graph rewriting, a fresh approach to term rewriting achieved through an equality saturation algorithm.","category":"page"},{"location":"","page":"Metatheory.jl","title":"Metatheory.jl","text":"Intuitively, Metatheory.jl transforms Julia expressions in other Julia expressions and can achieve such at both compile and run time. This allows Metatheory.jl users to perform customized and composable compiler optimization specifically tailored to single, arbitrary Julia packages. Our library provides a simple, algebraically composable interface to help scientists in implementing and reasoning about semantics and all kinds of formal systems, by defining concise rewriting rules in pure, syntactically valid Julia on a high level of abstraction. Our implementation of equality saturation on e-graphs is based on the excellent, state-of-the-art technique implemented in the egg library, reimplemented in pure Julia.","category":"page"},{"location":"#Recommended-Readings-Selected-Publications","page":"Metatheory.jl","title":"Recommended Readings - Selected Publications","text":"","category":"section"},{"location":"","page":"Metatheory.jl","title":"Metatheory.jl","text":"The Metatheory.jl introductory paper gives a brief high level overview on the library and its functionalities.\nThe Julia Manual metaprogramming section is fundamental to understand what homoiconic expression manipulation is and how it happens in Julia.\nAn introductory blog post on SIGPLAN about egg and e-graphs rewriting.\negg: Fast and Extensible Equality Saturation contains the original definition of E-Graphs on which Metatheory.jl's equality saturation e-graph rewriting backend is based. This is a strongly recommended reading.","category":"page"},{"location":"#Installation","page":"Metatheory.jl","title":"Installation","text":"","category":"section"},{"location":"","page":"Metatheory.jl","title":"Metatheory.jl","text":"You can install the stable version:","category":"page"},{"location":"","page":"Metatheory.jl","title":"Metatheory.jl","text":"julia> using Pkg; Pkg.add(\"Metatheory\")","category":"page"},{"location":"","page":"Metatheory.jl","title":"Metatheory.jl","text":"Or you can install the development version (recommended by now for latest bugfixes)","category":"page"},{"location":"","page":"Metatheory.jl","title":"Metatheory.jl","text":"julia> using Pkg; Pkg.add(url=\"https://github.com/0x0f0f0f/Metatheory.jl\")","category":"page"},{"location":"#Usage","page":"Metatheory.jl","title":"Usage","text":"","category":"section"},{"location":"","page":"Metatheory.jl","title":"Metatheory.jl","text":"Since Metatheory.jl relies on RuntimeGeneratedFunctions.jl, you have to call @metatheory_init in the module where you are going to use Metatheory.","category":"page"},{"location":"","page":"Metatheory.jl","title":"Metatheory.jl","text":"using Metatheory\nusing Metatheory.EGraphs\n\n@metatheory_init","category":"page"},{"location":"#Citing","page":"Metatheory.jl","title":"Citing","text":"","category":"section"},{"location":"","page":"Metatheory.jl","title":"Metatheory.jl","text":"If you use Metatheory.jl in your research, please cite our works.","category":"page"},{"location":"schedulers/#Scheduling-for-E-Graph-rewriting","page":"Scheduling for E-Graph rewriting","title":"Scheduling for E-Graph rewriting","text":"","category":"section"},{"location":"schedulers/","page":"Scheduling for E-Graph rewriting","title":"Scheduling for E-Graph rewriting","text":"Modules = [Metatheory.EGraphs.Schedulers]","category":"page"},{"location":"schedulers/#Metatheory.EGraphs.Schedulers.AbstractScheduler","page":"Scheduling for E-Graph rewriting","title":"Metatheory.EGraphs.Schedulers.AbstractScheduler","text":"abstract type AbstractScheduler\n\nRepresents a rule scheduler for the equality saturation process\n\n\n\nFields\n\n\n\n\n\n","category":"type"},{"location":"schedulers/#Metatheory.EGraphs.Schedulers.BackoffScheduler","page":"Scheduling for E-Graph rewriting","title":"Metatheory.EGraphs.Schedulers.BackoffScheduler","text":"mutable struct BackoffScheduler <: Metatheory.EGraphs.Schedulers.AbstractScheduler\n\nA Rewrite Scheduler that implements exponential rule backoff. For each rewrite, there exists a configurable initial match limit. If a rewrite search yield more than this limit, then we ban this rule for number of iterations, double its limit, and double the time it will be banned next time.\n\nThis seems effective at preventing explosive rules like associativity from taking an unfair amount of resources.\n\n\n\nFields\n\ndata::IdDict{AbstractRule, Metatheory.EGraphs.Schedulers.BackoffSchedulerEntry}\nG::EGraph\ntheory::Vector{var\"#s209\"} where var\"#s209\"<:AbstractRule\ncurr_iter::Int64\n\n\n\n\n\n","category":"type"},{"location":"schedulers/#Metatheory.EGraphs.Schedulers.ScoredScheduler","page":"Scheduling for E-Graph rewriting","title":"Metatheory.EGraphs.Schedulers.ScoredScheduler","text":"mutable struct ScoredScheduler <: Metatheory.EGraphs.Schedulers.AbstractScheduler\n\nA Rewrite Scheduler that implements exponential rule backoff. For each rewrite, there exists a configurable initial match limit. If a rewrite search yield more than this limit, then we ban this rule for number of iterations, double its limit, and double the time it will be banned next time.\n\nThis seems effective at preventing explosive rules like associativity from taking an unfair amount of resources.\n\n\n\nFields\n\ndata::IdDict{AbstractRule, Metatheory.EGraphs.Schedulers.ScoredSchedulerEntry}\nG::EGraph\ntheory::Vector{var\"#s209\"} where var\"#s209\"<:AbstractRule\ncurr_iter::Int64\n\n\n\n\n\n","category":"type"},{"location":"schedulers/#Metatheory.EGraphs.Schedulers.SimpleScheduler","page":"Scheduling for E-Graph rewriting","title":"Metatheory.EGraphs.Schedulers.SimpleScheduler","text":"struct SimpleScheduler <: Metatheory.EGraphs.Schedulers.AbstractScheduler\n\nA simple Rewrite Scheduler that applies every rule every time\n\n\n\nFields\n\n\n\n\n\n","category":"type"},{"location":"schedulers/#Metatheory.EGraphs.Schedulers.cansaturate","page":"Scheduling for E-Graph rewriting","title":"Metatheory.EGraphs.Schedulers.cansaturate","text":"Should return true if the e-graph can be said to be saturated\n\ncansaturate(s::AbstractScheduler)\n\n\n\nSignatures\n\n\n\nMethods\n\ncansaturate(s)\n\ndefined at /home/runner/work/Metatheory.jl/Metatheory.jl/src/EGraphs/Schedulers/backoffscheduler.jl:45.\n\ncansaturate(s)\n\ndefined at /home/runner/work/Metatheory.jl/Metatheory.jl/src/EGraphs/Schedulers/scoredscheduler.jl:84.\n\ncansaturate(s)\n\ndefined at /home/runner/work/Metatheory.jl/Metatheory.jl/src/EGraphs/Schedulers/simplescheduler.jl:6.\n\n\n\n\n\n","category":"function"},{"location":"schedulers/#Metatheory.EGraphs.Schedulers.cansearch","page":"Scheduling for E-Graph rewriting","title":"Metatheory.EGraphs.Schedulers.cansearch","text":"Should return false if the rule r should be skipped\n\ncansearch(s::AbstractScheduler, r::Rule)\n\n\n\nSignatures\n\n\n\nMethods\n\ncansearch(s, r)\n\ndefined at /home/runner/work/Metatheory.jl/Metatheory.jl/src/EGraphs/Schedulers/backoffscheduler.jl:25.\n\ncansearch(s, r)\n\ndefined at /home/runner/work/Metatheory.jl/Metatheory.jl/src/EGraphs/Schedulers/scoredscheduler.jl:26.\n\ncansearch(s, r)\n\ndefined at /home/runner/work/Metatheory.jl/Metatheory.jl/src/EGraphs/Schedulers/simplescheduler.jl:7.\n\n\n\n\n\n","category":"function"},{"location":"schedulers/#Metatheory.EGraphs.Schedulers.inform!","page":"Scheduling for E-Graph rewriting","title":"Metatheory.EGraphs.Schedulers.inform!","text":"This function is called after pattern matching on the e-graph, informs the scheduler about the yielded matches. Returns false if the matches should not be yielded and ignored. \n\ninform!(s::AbstractScheduler, iteration, r::Rule, matches)\n\n\n\nSignatures\n\n\n\nMethods\n\ninform!(s, rule, matches)\n\ndefined at /home/runner/work/Metatheory.jl/Metatheory.jl/src/EGraphs/Schedulers/backoffscheduler.jl:48.\n\ninform!(s, rule, matches)\n\ndefined at /home/runner/work/Metatheory.jl/Metatheory.jl/src/EGraphs/Schedulers/scoredscheduler.jl:87.\n\ninform!(s, r, matches)\n\ndefined at /home/runner/work/Metatheory.jl/Metatheory.jl/src/EGraphs/Schedulers/simplescheduler.jl:13.\n\n\n\n\n\n","category":"function"}]
}
