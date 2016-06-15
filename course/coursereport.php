<?php 
//IMathAS:  Main course page
//(c) 2006 David Lippman

/*** master php includes *******/
require("../validate.php");
require("courseshowitems.php");


/*** pre-html data manipulation, including function code *******/

//set some page specific variables and counters
$overwriteBody = 0;
$body = "";

if (!isset($teacherid) && !isset($tutorid) && !isset($studentid) && !isset($guestid)) { // loaded by a NON-teacher
	$overwriteBody=1;
	$body = _("You are not enrolled in this course.  Please return to the <a href=\"../index.php\">Home Page</a> and enroll\n");
} else { // PERMISSIONS ARE OK, PROCEED WITH PROCESSING
	$cid = $_GET['cid'];
	
   
		
	$query = "SELECT name,itemorder,hideicons,picicons,allowunenroll,msgset,toolset,chatset,topbar,cploc,latepasshrs FROM imas_courses WHERE id='$cid'";
	$result = mysql_query($query) or die("Query failed : " . mysql_error());
	$line = mysql_fetch_array($result, MYSQL_ASSOC);
	if ($line == null) {
		$overwriteBody = 1;
		$body = _("Course does not exist.  <a hre=\"../index.php\">Return to main page</a>") . "</body></html>\n";
	}	
	

	$query = "select count(distinct userid) as usercount,count(distinct assessmentid) as assessmentcount,count(userid) as totalcount from imas_assessment_sessions join imas_assessments on assessmentid=imas_assessments.id where courseid ='$cid' and from_unixtime(greatest(starttime,endtime)) > date_sub(now(),INTERVAL 1 WEEK)";
	$result = mysql_query($query) or die("Query failed : " . mysql_error());
	$line = mysql_fetch_array($result, MYSQL_ASSOC);

	$usercount = $line['usercount'];
	$assessmentcount = $line['assessmentcount'];
	$totalcount = $line['totalcount'];

	$query = "select count(userid) as totalstudents from imas_students where courseid ='$cid' ";
	$result = mysql_query($query) or die("Query failed : " . mysql_error());
	$line = mysql_fetch_array($result, MYSQL_ASSOC);

	$totalstudents = $line['totalstudents'];


	//DEFAULT DISPLAY PROCESSING
	$jsAddress1 = $urlmode . $_SERVER['HTTP_HOST'] . rtrim(dirname($_SERVER['PHP_SELF']), '/\\') . "/course.php?cid={$_GET['cid']}";
	$jsAddress2 = $urlmode . $_SERVER['HTTP_HOST'] . rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
	
	
	$curBreadcrumb = $breadcrumbbase;
	$curBreadcrumb .= "<a href=\"course.php?cid=$cid\">$coursename</a>   ";
	$curname = $coursename;

	



}

/******* begin html output ********/
require("../header.php");

/**** post-html data manipulation ******/
// this page has no post-html data manipulation

/***** page body *****/
/***** php display blocks are interspersed throughout the html as needed ****/
if ($overwriteBody==1) {
	echo $body;
} else {

	if (isset($teacherid)) {
 ?>  
	<script type="text/javascript">
		function moveitem(from,blk) { 
			var to = document.getElementById(blk+'-'+from).value;
			
			if (to != from) {
				var toopen = '<?php echo $jsAddress1 ?>&block=' + blk + '&from=' + from + '&to=' + to;
				window.location = toopen;
			}
		}
		
		function additem(blk,tb) {
			var type = document.getElementById('addtype'+blk+'-'+tb).value;
			if (tb=='BB' || tb=='LB') { tb = 'b';}
			if (type!='') {
				var toopen = '<?php echo $jsAddress2 ?>/add' + type + '.php?block='+blk+'&tb='+tb+'&cid=<?php echo $_GET['cid'] ?>';
				window.location = toopen;
			}
		}
	</script>

<?php
	}	
?>
	<script type="text/javascript">
		var getbiaddr = 'getblockitems.php?cid=<?php echo $cid ?>&folder=';
		var oblist = '<?php echo $oblist ?>';
		var plblist = '<?php echo $plblist ?>';
		var cid = '<?php echo $cid ?>';
	</script> 
	
<?php
	//check for course layout
	if (isset($CFG['GEN']['courseinclude'])) {
		require($CFG['GEN']['courseinclude']);
		if ($firstload) {
			echo "<script>document.cookie = 'openblocks-$cid=' + oblist;\n";
			echo "document.cookie = 'loadedblocks-$cid=0';</script>\n";
		}
		require("../footer.php");
		exit;
	}
?>
	<div class=breadcrumb>
		<?php 
		if (isset($CFG['GEN']['logopad'])) {
			echo '<span class="padright hideinmobile" style="padding-right:'.$CFG['GEN']['logopad'].'">';
		} else {
			echo '<span class="padright hideinmobile">';
		}
		if (isset($guestid)) {
			echo '<span class="red">', _('Instructor Preview'), '</span> ';
		}
		if (!isset($usernameinheader)) {
			echo $userfullname;
		} else { echo '&nbsp;';}
		?>
		</span>
		<?php echo $curBreadcrumb ?>
		<div class=clear></div>
	</div>
<?
   }
   makeTopMenu();
?>
   <div>
   
   In The last week:
   <table>
   <tr> <td>Num Students: </td><td><? echo $usercount; ?>
   (out of <? echo $totalstudents ?>) </td></tr>
   <tr> <td> Num Assessments Attempted: </td><td><? echo $assessmentcount; ?> </td></tr>
   <tr> <td> Total Num Attempts: </td><td><? echo $totalcount; ?> </td></tr>
</table>
   </div>
   <div>
   Student Summary:
<?
   $query = "select sid, count(ias.userid)"; // 1,2
$query .=", group_concat(ia.name) "; // 3
$query .= ", group_concat(ia.minscore SEPARATOR '#') "; //4
$query .= ", group_concat(ias.bestscores  SEPARATOR '#') "; //5
$query .= ", group_concat(ia.id  SEPARATOR '#') "; // 6
$query .= ", group_concat(ia.defpoints  SEPARATOR '#') "; // 7
$query .= ", group_concat(ia.itemorder  SEPARATOR '#') "; // 8

   $query .= " from imas_users as iu";
   $query .= " join imas_students as stu on iu.id = stu.userid ";
  $query .= " left join imas_assessment_sessions as ias ";
   $query .= " on iu.id = ias.userid";
   $query .=" left join imas_assessments as ia ";
$query .= " on assessmentid=ia.id  ";
$query .= " where iu.id = stu.userid";
 $query .= " or (ia.courseid = '$cid' and from_unixtime(greatest(starttime,endtime)) > ";
 $query .= " date_sub(now(),INTERVAL 1 WEEK))";
   $query .=" group by iu.sid ";
    $result = mysql_query($query) or die("Query failed : " . mysql_error());
?>
<table>
<tr>
   <th> Student </th>
   <th> Num Attempts </th>
   <th> Cumulative Score </th>
   </tr>
   
<?
$st = array();
$asPtsArr = array();
$asPossArr = array();
$i = 0;
while($line = mysql_fetch_row($result)) {
  $st[$i][0] = $line[0];
  $st[$i][1] = $line[1];
  $st[$i][2] = $line[2];
  $st[$i][3] = 0;
  $st[$i][4] = 0;  
  $st[$i][5] = "";
  $st[$i][6] = "";
  $st[$i][7] = 0;  
  $st[$i][8] = 0;  
  $st[$i][9] = "";
  for ($j = 0; $j < count($line); $j++) {
    if ($j < 3) {
      $st[$i][$j] =  $line[$j];
    } 
  }
  if($st[$i][1] > 0) {
  $assess = explode(',',$st[$i][2]);
  $minscores = explode('#',$line[3]);
  $bestscoresArr = explode('#',$line[4]);
  $aids = explode('#',$line[5]);
  $defpointsArr = explode('#',$line[6]);
  $itemorderArr = explode('#',$line[7]);








  
  $ncc = "";
  $cc = "";
  for($k = 0; $k < count($minscores); $k++) {


    $aitems = explode(',',$itemorderArr[$k]);
    $n = 0;
    $atofind = array();
    foreach ($aitems as $v) {
      if (strpos($v,'~')!==FALSE) {
	$sub = explode('~',$v);
	if (strpos($sub[0],'|')===false) { //backwards compat
	  $atofind[$n] = $sub[0];
	  $aitemcnt[$n] = 1;
	  $n++;
	} else {
	  $grpparts = explode('|',$sub[0]);
	  if ($grpparts[0]==count($sub)-1) { //handle diff point values in group if n=count of group
	    for ($i=1;$i<count($sub);$i++) {
	      $atofind[$n] = $sub[$i];
	      $aitemcnt[$n] = 1;
	      $n++;
	    }
	  } else {
	    $atofind[$n] = $sub[1];
	    $aitemcnt[$n] = $grpparts[0];
	    $n++;
	  }
	}
      } else {
	$atofind[$n] = $v;
	$aitemcnt[$n] = 1;
	$n++;
      }
    }








    $sp = explode(';',$bestscoresArr[$k]);
    $scores = explode(',',$sp[0]);
    $query = "SELECT points,id FROM imas_questions WHERE assessmentid='{$aids[$k]}'";
    $result2 = mysql_query($query) or die("Query failed : $query: " . mysql_error());
    $totalpossible = 0;
    while ($r = mysql_fetch_row($result2)) {
      if (($m = array_search($r[1],$atofind))!==false) { //only use first item from grouped questions for total pts	
	if ($r[0]==9999) {
	  $totalpossible += $aitemcnt[$m]*$defpointsArr[$k]; //use defpoints
	} else {
	  $totalpossible += $aitemcnt[$m]*$r[0]; //use points from question
	}
      }
    }
    $possible[$k] = $totalpossible;
    $asPossArr["'{$aids[$k]}'"] = $possible[$k];
    if (!isset($asPtsArr["'{$aids[$k]}'"])) {
      $asPtsArr["'{$aids[$k]}'"] = 0;
    }

    //    $possible[$k] = $pointsArr[$k];
    $pts = 0;
    for ($l=0;$l<count($scores);$l++) {
      $pts += getpts($scores[$l]);
    }
    //    if (($minscores[$k]<10000 && $pts<$minscores[$k]) || ($minscores[$k]>10000 && $pts<($minscores[$k]-10000)/100*$possible[$k])) {
    if ($pts<(0.5*$possible[$k])) {     
      $st[$i][3]++;
      $st[$i][5] .= $ncc;
      $st[$i][5] .= $assess[$k];
      $ncc = ":";
    } else {
      $st[$i][4]++;        
      $st[$i][6] .= $cc;
      $st[$i][6] .= $assess[$k];
      $cc = ":";
    }
    $st[$i][7] = $st[$i][7] + $possible[$k];
    $st[$i][8] = $st[$i][8] + $pts;
    $asPtsArr["'{$aids[$k]}'"] += $pts;
    
  }
  }
   ?>
   <tr>
      <td> <? echo $st[$i][0]; ?> </td>
      <td> <? echo $st[$i][1]; ?> </td>
      <td> <? if ($st[$i][7] > 0) {
                $pc = "{$st[$i][8]}/{$st[$i][7]}";
              } else { $pc = "NA"; }
              echo $pc; ?> </td>

   </tr>
<?
      
  $i++;
}
$numrows = $i;
?>

</table>
<table>
<tr>
   <th> Student </th>
   <th> Num Attempts </th>
   <th> Under 50% </th>
<th> &gt;= 50% </th>
   </tr>
<?
for($i = 0; $i < $numrows; $i++) {

?>
   <tr>
      <td> <? echo $st[$i][0]; ?> </td>
      <td> <? echo $st[$i][1]; ?> </td>
      <td> <? echo $st[$i][5]; ?> </td>
      <td> <? echo $st[$i][6]; ?> </td>

   </tr>
<? }      ?>
</table>
   Assessment Summary:
<?
   $query = "select ia.name, count(userid),ia.id ";
   $query .= " from imas_assessment_sessions join imas_users as iu";
   $query .= " on iu.id = userid join imas_assessments as ia ";
   $query .= " on assessmentid=ia.id where courseid = '$cid' ";
   $query .= " and from_unixtime(greatest(starttime,endtime)) > ";
   $query .= " date_sub(now(),INTERVAL 1 WEEK) group by ia.id ";
   $result = mysql_query($query) or die("Query failed : " . mysql_error());
?>
<table>
<tr>
   <th> Assessment </th>
   <th> Num Attempts </th>
   <th> Average Score </th>
   </tr>
<?
   $atbl = array();
   $k = 0;
while($line = mysql_fetch_row($result)) {
  for ($j = 0; $j < count($line); $j++) {
      $atbl[$k][$j] =  $line[$j];
  }
  $numnc = 0;
  $numcred = 0;
  $credusers = "[";
  $nocredusers = "[";
  for($i = 0; $i < $numrows; $i++) {
    $snocred = explode(":",$st[$i][5]);
    $scred = explode(":",$st[$i][6]);
    if(in_array($line[0],$snocred)) {
      $numnc++;
      $nocredusers .= $st[$i][0];
    } else if(in_array($line[0],$scred)) {
      $numcred++;
      $credusers .= $st[$i][0];
    }
  }
  $nocredusers .= "]";
  $credusers .= "]";
  
  $atbl[$k][3] = $numnc;
  $atbl[$k][4] = $numcred;
  $atbl[$k][5] = $nocredusers;
  $atbl[$k][6] = $credusers;
  if($atbl[$k][1] > 0) {
    $index = "'{$atbl[$k][2]}'";
    //$atbl[$k][7] = $index;
        $atbl[$k][7] = $asPtsArr[$index]*100/$asPossArr[$index];
  } else {
    $atbl[$k][7] = 0;
  }

  ?>
   <tr>
    <td> <? echo $line[0] ?> </td>
    <td> <? echo $line[1] ?> </td>

      <td> <? echo  $atbl[$k][7]."%"; ?> </td>

   </tr>
<?
   $k++;

}

?>

</table>
    <table>
<tr>
   <th> Assessment </th>
   <th> Num Attempts </th>
<th> &lt; 50% </th>
<th> &gt;= 50% </th>
   </tr>
<?
    $numrows = $k;
for($i = 0; $i < $numrows; $i++) {

?>
   <tr>
      <td> <? echo $atbl[$i][0]; ?> </td>
      <td> <? echo $atbl[$i][1]; ?> </td>
      <td> <? echo $atbl[$i][5]; ?> </td>
      <td> <? echo $atbl[$i][6]; ?> </td>

   </tr>
<? }      ?>
</table>



    




   
<?
require("../footer.php");

function makeTopMenu() {
	global $teacherid;
	global $topbar;
	global $msgset;
	global $previewshift;
	global $imasroot;
	global $cid;
	global $newmsgs;
	global $quickview;
	global $newpostscnt;
	global $coursenewflag;
	global $CFG;
	global $useviewbuttons;
	
	if ($useviewbuttons && (isset($teacherid) || $previewshift>-1)) {
		echo '<div id="viewbuttoncont">View: ';
		echo "<a href=\"course.php?cid=$cid&quickview=off&teachview=1\" ";
		if ($previewshift==-1 && $quickview != 'on') {
			echo 'class="buttonactive buttoncurveleft"';
		} else {
			echo 'class="buttoninactive buttoncurveleft"';
		}
		echo '>', _('Instructor'), '</a>';
		echo "<a href=\"course.php?cid=$cid&quickview=off&stuview=0\" ";
		if ($previewshift>-1 && $quickview != 'on') {
			echo 'class="buttonactive"';
		} else {
			echo 'class="buttoninactive"';
		}
		echo '>', _('Student'), '</a>';
		echo "<a href=\"course.php?cid=$cid&quickview=on&teachview=1\" ";
		if ($previewshift==-1 && $quickview == 'on') {
			echo 'class="buttonactive buttoncurveright"';
		} else {
			echo 'class="buttoninactive buttoncurveright"';
		}
		echo '>', _('Quick Rearrange'), '</a>';
		echo '</div>';
		//echo '<br class="clear"/>';
			
		
	} else {
		$useviewbuttons = false;
	}
	
	if (isset($teacherid) && $quickview=='on') {
		if ($useviewbuttons) {
			echo '<br class="clear"/>';
		}
		echo '<div class="cpmid">';
		if (!$useviewbuttons) {
			echo _('Quick View.'), " <a href=\"course.php?cid=$cid&quickview=off\">", _('Back to regular view'), "</a>. ";
		} 
		if (isset($CFG['CPS']['miniicons'])) {
			echo _('Use icons to drag-and-drop order.'),' ',_('Click the icon next to a block to expand or collapse it. Click an item title to edit it in place.'), '  <input type="button" id="recchg" disabled="disabled" value="', _('Save Changes'), '" onclick="submitChanges()"/>';
		
		} else {
			echo _('Use colored boxes to drag-and-drop order.'),' ',_('Click the B next to a block to expand or collapse it. Click an item title to edit it in place.'), '  <input type="button" id="recchg" disabled="disabled" value="', _('Save Changes'), '" onclick="submitChanges()"/>';
		}
		 echo '<span id="submitnotice" style="color:red;"></span>';
		 echo '<div class="clear"></div>';
		 echo '</div>';
		
	}
	if (($coursenewflag&1)==1) {
		$gbnewflag = ' <span class="red">' . _('New') . '</span>';
	} else {
		$gbnewflag = '';
	}
	if (isset($teacherid) && count($topbar[1])>0 && $topbar[2]==0) {
		echo '<div class=breadcrumb>';
		if (in_array(0,$topbar[1]) && $msgset<4) { //messages
			echo "<a href=\"$imasroot/msgs/msglist.php?cid=$cid\">", _('Messages'), "</a>$newmsgs &nbsp; ";
		}
		if (in_array(6,$topbar[1])) { //Calendar
			echo "<a href=\"$imasroot/forums/forums.php?cid=$cid\">", _('Forums'), "</a>$newpostscnt &nbsp; ";
		}
		if (in_array(1,$topbar[1])) { //Stu view
			echo "<a href=\"course.php?cid=$cid&stuview=0\">", _('Student View'), "</a> &nbsp; ";
		}
		if (in_array(3,$topbar[1])) { //List stu
			echo "<a href=\"listusers.php?cid=$cid\">", _('Roster'), "</a> &nbsp; \n";
		}
		if (in_array(2,$topbar[1])) { //Gradebook
			echo "<a href=\"gradebook.php?cid=$cid\">", _('Gradebook'), "</a>$gbnewflag &nbsp; ";
		}
		if (in_array(7,$topbar[1])) { //List stu
			echo "<a href=\"managestugrps.php?cid=$cid\">", _('Groups'), "</a> &nbsp; \n";
		}
		if (in_array(4,$topbar[1])) { //Calendar
			echo "<a href=\"showcalendar.php?cid=$cid\">", _('Calendar'), "</a> &nbsp; \n";
		}
		if (in_array(5,$topbar[1])) { //Calendar
			echo "<a href=\"course.php?cid=$cid&quickview=on\">", _('Quick View'), "</a> &nbsp; \n";
		}
		
		if (in_array(9,$topbar[1])) { //Log out
			echo "<a href=\"../actions.php?action=logout\">", _('Log Out'), "</a>";
		}
		echo '<div class=clear></div></div>';
	} else if (!isset($teacherid) && ((count($topbar[0])>0 && $topbar[2]==0) || ($previewshift>-1 && !$useviewbuttons))) {
		echo '<div class=breadcrumb>';
		if ($topbar[2]==0) {
			if (in_array(0,$topbar[0]) && $msgset<4) { //messages
				echo "<a href=\"$imasroot/msgs/msglist.php?cid=$cid\">", _('Messages'), "</a>$newmsgs &nbsp; ";
			}
			if (in_array(3,$topbar[0])) { //forums
				echo "<a href=\"$imasroot/forums/forums.php?cid=$cid\">", _('Forums'), "</a>$newpostscnt &nbsp; ";
			}
			if (in_array(1,$topbar[0])) { //Gradebook
				echo "<a href=\"gradebook.php?cid=$cid\">", _('Show Gradebook'), "</a>$gbnewflag &nbsp; ";
			}
			if (in_array(2,$topbar[0])) { //Calendar
				echo "<a href=\"showcalendar.php?cid=$cid\">", _('Calendar'), "</a> &nbsp; \n";
			}
			if (in_array(9,$topbar[0])) { //Log out
				echo "<a href=\"../actions.php?action=logout\">", _('Log Out'), "</a>";
			}
			if ($previewshift>-1 && count($topbar[0])>0) { echo '<br />';}
		}
		if ($previewshift>-1 && !$useviewbuttons) {
			echo _('Showing student view. Show view:'), ' <select id="pshift" onchange="changeshift()">';
			echo '<option value="0" ';
			if ($previewshift==0) {echo "selected=1";}
			echo '>', _('Now'), '</option>';
			echo '<option value="3600" ';
			if ($previewshift==3600) {echo "selected=1";}
			echo '>', _('1 hour from now'), '</option>';
			echo '<option value="14400" ';
			if ($previewshift==14400) {echo "selected=1";}
			echo '>', _('4 hours from now'), '</option>';
			echo '<option value="86400" ';
			if ($previewshift==86400) {echo "selected=1";}
			echo '>', _('1 day from now'), '</option>';
			echo '<option value="604800" ';
			if ($previewshift==604800) {echo "selected=1";}
			echo '>', _('1 week from now'), '</option>';
			echo '</select>';
			echo " <a href=\"course.php?cid=$cid&teachview=1\">", _('Back to instructor view'), "</a>";
		}
		echo '<div class=clear></div></div>';
	}
}




?>

