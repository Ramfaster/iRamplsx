function gFnAssetComma ( obj )
{
    $ ( obj ).val ( homUtil.mathFloorComma ( $ ( obj ).val () ) );
}

function gFnAssetAddCommas ( obj )
{
    var x = $ ( obj ).val ();
    // alert ( x );
    if ( $ ( obj ) !== undefined )
    {
        // var parts = x.toString ().split ( "." );
        // parts[0] = parts[0].replace ( /\B(?=(\d{3})+(?!\d))/g, "," );
        // x = parts.join ( "." );
        // $ ( obj ).val ( x );

        if ( $ ( obj ).val () !== '' )
        {
            $ ( obj ).val ( homUtil.mathFloorComma ( $ ( obj ).val (), staticVariable.decimalPoint ) );
        }

    }
    // $ ( obj ).val ( x.toLocaleString () );

}
