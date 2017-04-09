/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
"*"                   return '*'
"/"                   return '/'
"-"                   return '-'
"+"                   return '+'
"^"                   return '^'
"("                   return '('
")"                   return ')'
"PI"                  return 'PI'
"E"                   return 'E'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%left '^'
%left UMINUS

%start expressions

%% /* language grammar */

expressions
    : e EOF
        {return $1;}
    ;

e
    : e '+' e
        {$$ = {type: 'ADD', left: $1, right: $3};}
    | e '-' e
        {$$ = {type: 'SUB', left: $1, right: $3};}
    | e '*' e
        {$$ = {type: 'MUL', left: $1, right: $3};}
    | e '/' e
        {$$ = {type: 'DIV', left: $1, right: $3};}
    | e '^' e
        {$$ = {type: 'POW', left: $1, right: $3};}
    | '-' e %prec UMINUS
        {$$ = {type: 'UNEG', left: $2};}
    | '(' e ')'
        {$$ = $2;}
    | NUMBER
        {$$ = Number(yytext);}
    | E
        {$$ = Math.E;}
    | PI
        {$$ = Math.PI;}
    ;
