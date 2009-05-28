<%@ page contentType="application/xml; charset=gb2312" import="com.educhina.Employee"%>
<%@ page import="java.util.Collection,java.util.ArrayList"%>
<?xml version="1.0"?>
<%@ taglib uri="/WEB-INF/struts-logic.tld" prefix="logic" %>
<%@ taglib uri="/WEB-INF/struts-bean.tld" prefix="bean"%>
<%
Employee em1 = new Employee();
em1.setName("J.Doe");
em1.setJob("Programmer");
em1.setSalary("32768");
Employee em2 = new Employee();
em2.setName("A.Baker");
em2.setJob("Sales");
em2.setSalary("70000");
Employee em3 = new Employee();
em3.setName("Big Cheese");
em3.setJob("CEO");
em3.setSalary("100000");
Collection employees = new ArrayList();
employees.add(em1);
employees.add(em2);
employees.add(em3);
pageContext.setAttribute("employees",employees);
%>
<employees>
<logic:iterate name="employees" id="employee">
	<employee name="<bean:write name='employee' property='name'/>">
		<job><bean:write name="employee" property="job"/></job>
		<salary><bean:write name="employee" property="salary"/></salary>
	</employee>
</logic:iterate>
</employees>

