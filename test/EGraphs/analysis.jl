# example assuming * operation is always binary

# ENV["JULIA_DEBUG"] = Metatheory

using Metatheory
using Metatheory.Library
using TermInterface

EGraphs.make(::Val{:numberfold}, g::EGraph, n::ENodeLiteral) = n.value


# This should be auto-generated by a macro
function EGraphs.make(::Val{:numberfold}, g::EGraph, n::ENodeTerm)
  if exprhead(n) == :call && arity(n) == 2
    op = operation(n)
    args = arguments(n)
    l = g[args[1]]
    r = g[args[2]]
    ldata = getdata(l, :numberfold, nothing)
    rdata = getdata(r, :numberfold, nothing)

    # @show ldata rdata

    if ldata isa Number && rdata isa Number
      if op == :*
        return ldata * rdata
      elseif op == :+
        return ldata + rdata
      end
    end
  end

  return nothing
end

function EGraphs.join(an::Val{:numberfold}, from, to)
  if from isa Number
    if to isa Number
      @assert from == to
    else
      return from
    end
  end
  return to
end

function EGraphs.modify!(::Val{:numberfold}, g::EGraph, id::Int64)
  eclass = g.classes[id]
  d = getdata(eclass, :numberfold, nothing)
  if d isa Number
    merge!(g, addexpr!(g, d), id)
  end
end

EGraphs.islazy(::Val{:numberfold}) = false


comm_monoid = @theory begin
  ~a * ~b --> ~b * ~a
  ~a * 1 --> ~a
  ~a * (~b * ~c) --> (~a * ~b) * ~c
end

G = EGraph(:(3 * 4))
analyze!(G, :numberfold)

# exit(0)

@testset "Basic Constant Folding Example - Commutative Monoid" begin
  @test (true == @areequalg G comm_monoid 3 * 4 12)

  @test (true == @areequalg G comm_monoid 3 * 4 12 4 * 3 6 * 2)
end

@testset "Basic Constant Folding Example 2 - Commutative Monoid" begin
  ex = :(a * 3 * b * 4)
  G = EGraph(ex)
  analyze!(G, :numberfold)
  addexpr!(G, :(12 * a))
  @test (true == @areequalg G comm_monoid (12 * a) * b ((6 * 2) * b) * a)
  @test (true == @areequalg G comm_monoid (3 * a) * (4 * b) (12 * a) * b ((6 * 2) * b) * a)
end

@testset "Basic Constant Folding Example - Adding analysis after saturation" begin
  G = EGraph(:(3 * 4))
  # addexpr!(G, 12)
  saturate!(G, comm_monoid)
  addexpr!(G, :(a * 2))
  analyze!(G, :numberfold)
  saturate!(G, comm_monoid)

  @test (true == areequal(G, comm_monoid, :(3 * 4), 12, :(4 * 3), :(6 * 2)))

  ex = :(a * 3 * b * 4)
  G = EGraph(ex)
  analyze!(G, :numberfold)
  params = SaturationParams(timeout = 15)
  @test areequal(G, comm_monoid, :((3 * a) * (4 * b)), :((12 * a) * b), :(((6 * 2) * b) * a); params = params)
end

@testset "Infinite Loops analysis" begin
  boson = @theory begin
    1 * ~x --> ~x
  end


  G = EGraph(:(1 * x))
  params = SaturationParams(timeout = 100)
  saturate!(G, boson, params)
  ex = extract!(G, astsize)


  boson = @theory begin
    (:c * :cdag) --> :cdag * :c + 1
    ~a * (~b + ~c) --> (~a * ~b) + (~a * ~c)
    (~b + ~c) * ~a --> (~b * ~a) + (~c * ~a)
    # 1 * x => x
    (~a * ~b) * ~c --> ~a * (~b * ~c)
    ~a * (~b * ~c) --> (~a * ~b) * ~c
  end

  g = EGraph(:(c * c * cdag * cdag))
  saturate!(g, boson)
  ex = extract!(g, astsize_inv)

end

@testset "Extraction" begin
  comm_monoid = @commutative_monoid (*) 1

  fold_mul = @theory begin
    ~a::Number * ~b::Number => ~a * ~b
  end

  t = comm_monoid ∪ fold_mul


  @testset "Extraction 1 - Commutative Monoid" begin
    G = EGraph(:(3 * 4))
    saturate!(G, t)
    @test (12 == extract!(G, astsize))

    ex = :(a * 3 * b * 4)
    G = EGraph(ex)
    params = SaturationParams(timeout = 15)
    saturate!(G, t, params)
    extr = extract!(G, astsize)
    @test extr == :((12 * a) * b) ||
          extr == :(12 * (a * b)) ||
          extr == :(a * (b * 12)) ||
          extr == :((a * b) * 12) ||
          extr == :((12a) * b) ||
          extr == :(a * (12b)) ||
          extr == :((b * (12a))) ||
          extr == :((b * 12) * a) ||
          extr == :((b * a) * 12) ||
          extr == :(b * (a * 12)) ||
          extr == :((12b) * a)
  end

  fold_add = @theory begin
    ~a::Number + ~b::Number => ~a + ~b
  end

  @testset "Extraction 2" begin
    comm_group = @commutative_group (+) 0 inv


    t = comm_monoid ∪ comm_group ∪ (@distrib (*) (+)) ∪ fold_mul ∪ fold_add

    # for i ∈ 1:20
    # sleep(0.3)
    ex = :((x * (a + b)) + (y * (a + b)))
    G = EGraph(ex)
    saturate!(G, t)
    # end

    extract!(G, astsize) == :((y + x) * (b + a))
  end

  @testset "Extraction - Adding analysis after saturation" begin
    G = EGraph(:(3 * 4))
    addexpr!(G, 12)
    saturate!(G, t)
    addexpr!(G, :(a * 2))
    saturate!(G, t)

    saturate!(G, t)

    @test (12 == extract!(G, astsize))

    # for i ∈ 1:100
    ex = :(a * 3 * b * 4)
    G = EGraph(ex)
    analyze!(G, :numberfold)
    params = SaturationParams(timeout = 15)
    saturate!(G, comm_monoid, params)

    extr = extract!(G, astsize)

    @test extr == :((12 * a) * b) ||
          extr == :(12 * (a * b)) ||
          extr == :(a * (b * 12)) ||
          extr == :((a * b) * 12) ||
          extr == :((12a) * b) ||
          extr == :(a * (12b)) ||
          extr == :((b * (12a))) ||
          extr == :((b * 12) * a) ||
          extr == :((b * a) * 12) ||
          extr == :(b * (a * 12))
  end


  comm_monoid = @commutative_monoid (*) 1

  comm_group = @commutative_group (+) 0 inv

  powers = @theory begin
    ~a * ~a → (~a)^2
    ~a → (~a)^1
    (~a)^~n * (~a)^~m → (~a)^(~n + ~m)
  end
  logids = @theory begin
    log((~a)^~n) --> ~n * log(~a)
    log(~x * ~y) --> log(~x) + log(~y)
    log(1) --> 0
    log(:e) --> 1
    :e^(log(~x)) --> ~x
  end

  G = EGraph(:(log(e)))
  params = SaturationParams(timeout = 9)
  saturate!(G, logids, params)
  @test extract!(G, astsize) == 1


  t = comm_monoid ∪ comm_group ∪ (@distrib (*) (+)) ∪ powers ∪ logids ∪ fold_mul ∪ fold_add

  @testset "Complex Extraction" begin
    G = EGraph(:(log(e) * log(e)))
    params = SaturationParams(timeout = 9)
    saturate!(G, t, params)
    @test extract!(G, astsize) == 1

    G = EGraph(:(log(e) * (log(e) * e^(log(3)))))
    params = SaturationParams(timeout = 7)
    saturate!(G, t, params)
    @test extract!(G, astsize) == 3

    @time begin
      G = EGraph(:(a^3 * a^2))
      saturate!(G, t)
      ex = extract!(G, astsize)
    end
    @test ex == :(a^5)

    @time begin
      G = EGraph(:(a^3 * a^2))
      saturate!(G, t)
      ex = extract!(G, astsize)
    end
    @test ex == :(a^5)

    function cust_astsize(n::ENodeTerm, g::EGraph)
      cost = 1 + arity(n)

      if operation(n) == :^
        cost += 2
      end

      for id in arguments(n)
        eclass = g[id]
        !hasdata(eclass, cust_astsize) && (cost += Inf; break)
        cost += last(getdata(eclass, cust_astsize))
      end
      return cost
    end


    cust_astsize(n::ENodeLiteral, g::EGraph) = 1

    @time begin
      G = EGraph(:((log(e) * log(e)) * (log(a^3 * a^2))))
      saturate!(G, t)
      @show getcost!(G, cust_astsize)
      ex = extract!(G, cust_astsize)
    end
    @show ex
    @test ex == :(5 * log(a)) || ex == :(log(a) * 5)
  end

  function costfun(n::ENodeTerm, g::EGraph)
    arity(n) != 2 && (return 1)
    left = arguments(n)[1]
    left_class = g[left]
    ENodeLiteral(:a) ∈ left_class.nodes ? 1 : 100
  end

  costfun(n::ENodeLiteral, g::EGraph) = 1


  moveright = @theory begin
    (:b * (:a * ~c)) --> (:a * (:b * ~c))
  end

  expr = :(a * (a * (b * (a * b))))
  res = rewrite(expr, moveright)

  g = EGraph(expr)
  saturate!(g, moveright)
  resg = extract!(g, costfun)

  @testset "Symbols in Right hand" begin
    @test resg == res == :(a * (a * (a * (b * b))))
  end

  function ⋅ end
  co = @theory begin
    sum(~x ⋅ :bazoo ⋅ :woo) --> sum(:n * ~x)
  end
  @testset "Consistency with classical backend" begin
    ex = :(sum(wa(rio) ⋅ bazoo ⋅ woo))
    g = EGraph(ex)
    saturate!(g, co)

    res = extract!(g, astsize)

    resclassic = rewrite(ex, co)

    @test res == resclassic
  end


  @testset "No arguments" begin
    ex = :(f())
    g = EGraph(ex)
    @test :(f()) == extract!(g, astsize)

    ex = :(sin() + cos())

    t = @theory begin
      sin() + cos() --> tan()
    end

    gg = EGraph(ex)
    saturate!(gg, t)
    @show getcost!(gg, astsize)
    res = extract!(gg, astsize)

    @test res == :(tan())
  end


  @testset "Symbol or function object operators in expressions in EGraphs" begin
    ex = :(($+)(x, y))
    t = [@rule a b a + b => 2]
    g = EGraph(ex)
    saturate!(g, t)
    @test extract!(g, astsize) == 2
  end
end
