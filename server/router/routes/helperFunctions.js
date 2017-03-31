// date check helper function
module.exports = {

/////////////////////////////////////////
// Function takes two date objects.
// Returns true if firstDate is prior
// to secondDate. Otherwise, returns 
// false.
///////////////////////////////////////////

futureDate: function(firstDate, secondDate){
    console.log("in futureDate. firstDate/secondDate: ", firstDate, secondDate);
    if(firstDate<secondDate)
        return true;
    return false;
},

/////////////////////////////////////////
// Function takes two date objects.
// Returns the difference between
// the second date and the first date.
///////////////////////////////////////////
dateDiffInDays: function(a, b) {
    //console.log("in dateDiffDays. firstDate/secondDate: ", a, b);
    var _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  //var aDate = a;
  //var bDate = b;
  var utc1 = Date.UTC(a.getYear(), a.getMonth(), a.getDate());
  var utc2 = Date.UTC(b.getYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);

    
},

/////////////////////////////////////////
// Function takes a date object.
// Returns an integer representing the 
// EMC quarter the date corresponds with.
///////////////////////////////////////////

whichQuarter: function(date){
    var month = date.getMonth();
    console.log("this is the month in whichQuarter func: ", month);
    var quarter;
    if (month<2) quarter = 4;
    else if (month<5) quarter =1;
    else if (month<8) quarter =2;
    else quarter = 3;
    console.log("Quarter: ", quarter);
    return quarter;
},

/////////////////////////////////////////
// Function takes two date objects.
// Returns true if today's Date is within
// six months of purchase date. Otherwise,
// returns false.
///////////////////////////////////////////

pastYear: function(purchaseDate, todaysDate){
    
    var diffDays = this.dateDiffInDays(purchaseDate,todaysDate);
    
    if(diffDays <=182 && diffDays>0)
        return true;
    
    return false;
    
},

/////////////////////////////////////////
// Function takes 4 arrays and two ints
// Preconditions: quarter param must be
// between 1 and 4.
// This function either increments the 
// count held in the arrays at a specific
// index, or pushes a 0 or 1 onto the arrays
///////////////////////////////////////////

fillQuarterArrays: function(q1,q2,q3,q4,quarter,index){
    
    if(index>=0)
    {
    
        switch(quarter)
        {

            case 1:
                q1[index]++;
                break;
            case 2:
                q2[index]++;
                break;
            case 3:
                q3[index]++;
                break;
            case 4:
                q4[index]++;
                break;
        }
    
    }
    else
    {
        switch(quarter)
        {
            case 1:
                q1.push(1);
                q2.push(0);
                q3.push(0);
                q4.push(0);
                break;
            case 2:
                q1.push(0);
                q2.push(1);
                q3.push(0);
                q4.push(0);
                break;
            case 3:
                q1.push(0);
                q2.push(0);
                q3.push(1);
                q4.push(0);
                break;
            case 4:
                q1.push(0);
                q2.push(0);
                q3.push(0);
                q4.push(1);
                break;     
        }
    
    }
    
},
    
/////////////////////////////////////////
// Function takes an array and string
// Preconditions: array must have at least
// a length of 7. 
// Function increments the count held in
// each array if the string matches the
// condition.
///////////////////////////////////////////

fillSrsCountArray: function(array, sev){
    if(sev =="S1") array[0]++;
    else if(sev =="S2") array[1]++;
    else if(sev =="S3") array[2]++;
    else if(sev =="S4") array[3]++;
    else if(sev =="S5") array[4]++;
    else if(sev =="S6") array[5]++;
    else if(sev =="S7") array[6]++;
    
}
    

    
    
};
